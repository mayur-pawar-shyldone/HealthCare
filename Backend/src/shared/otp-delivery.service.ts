import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type OtpChannel = 'whatsapp' | 'sms' | 'dev';

export type OtpDeliveryResult = {
  channel: OtpChannel;
  delivered: boolean;
  verificationId?: string;
};

function digits(value: string) {
  return value.replace(/\D/g, '');
}

function e164In(mobile: string) {
  const d = digits(mobile);
  const ten = d.length === 12 && d.startsWith('91') ? d.slice(2) : d;
  return { ten, e164: `+91${ten}`, wa: `91${ten}` };
}

async function readBody(res: Response) {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

type Fast2SmsWaba = {
  phoneNumberId?: string;
  displayNumber?: string;
  messageId?: string;
};

@Injectable()
export class OtpDeliveryService {
  private readonly logger = new Logger(OtpDeliveryService.name);
  private fast2SmsWaba?: { at: number; value: Fast2SmsWaba };

  constructor(private config: ConfigService) {}

  isMessageCentralEnabled() {
    return Boolean(this.messageCentralConfig());
  }

  async send(mobile: string, otp: string): Promise<OtpDeliveryResult> {
    const message = `Your HealthID Card OTP is ${otp}. It is valid for 5 minutes. Do not share this code.`;
    const dest = e164In(mobile);
    const errors: string[] = [];

    const prefer = (this.config.get<string>('OTP_CHANNEL') ?? 'auto').toLowerCase();
    const useMc = this.isMessageCentralEnabled();
    const tryWhatsApp = !useMc && (prefer === 'auto' || prefer === 'whatsapp');
    const trySms = prefer === 'auto' || prefer === 'sms' || useMc;

    if (tryWhatsApp) {
      const wa = await this.sendWhatsApp(dest.wa, dest.ten, otp, message);
      if (wa.ok) return { channel: 'whatsapp', delivered: true };
      if (wa.error) errors.push(wa.error);
    }

    if (trySms) {
      const sms = await this.sendSms(dest.ten, dest.e164, otp, message);
      if (sms.ok) return { channel: 'sms', delivered: true, verificationId: sms.verificationId };
      if (sms.error) errors.push(sms.error);
      if (useMc) {
        this.logger.error(`Message Central OTP failed for ${dest.ten}: ${sms.error || 'unknown error'}`);
        throw new Error('OTP_DELIVERY_FAILED');
      }
    }

    if (this.config.get('NODE_ENV') !== 'production') {
      this.logger.warn(`OTP for ${dest.ten}: ${otp} (no WhatsApp/SMS provider configured)`);
      if (errors.length) this.logger.warn(errors.join(' | '));
      return { channel: 'dev', delivered: false };
    }

    this.logger.error(`OTP delivery failed for ${dest.ten}: ${errors.join(' | ') || 'no provider configured'}`);
    throw new Error('OTP_DELIVERY_FAILED');
  }

  private async sendWhatsApp(wa: string, ten: string, otp: string, message: string) {
    const fastWa = await this.sendFast2SmsWhatsApp(wa, ten, otp, message);
    if (fastWa.ok) return fastWa;
    const cloud = await this.sendWhatsAppCloud(wa, otp, message);
    if (cloud.ok) return cloud;
    const green = await this.sendGreenApi(wa, message);
    if (green.ok) return green;
    const twoFactorWa = await this.sendTwoFactor(ten, otp, 'whatsapp');
    if (twoFactorWa.ok) return { ok: true as const };
    const error = [fastWa.error, cloud.error, green.error, twoFactorWa.error].filter(Boolean).join(' | ');
    return { ok: false as const, error: error || undefined };
  }

  private async sendSms(
    ten: string,
    e164: string,
    otp: string,
    message: string,
  ): Promise<{ ok: true; verificationId?: string } | { ok: false; error?: string }> {
    if (this.isMessageCentralEnabled()) {
      return this.sendMessageCentral(ten);
    }
    const horizon = await this.sendSmsHorizon(ten, message);
    if (horizon.ok) return horizon;
    const msg91 = await this.sendMsg91(ten, otp);
    if (msg91.ok) return msg91;
    const fast = await this.sendFast2Sms(ten, otp, message);
    if (fast.ok) return fast;
    const twoFactor = await this.sendTwoFactor(ten, otp, 'sms');
    if (twoFactor.ok) return twoFactor;
    const textbee = await this.sendTextBee(e164, message);
    if (textbee.ok) return textbee;
    const textbelt = await this.sendTextBelt(e164, message);
    if (textbelt.ok) return textbelt;
    const error = [horizon.error, msg91.error, fast.error, twoFactor.error, textbee.error, textbelt.error]
      .filter(Boolean)
      .join(' | ');
    return { ok: false as const, error: error || undefined };
  }

  private messageCentralConfig() {
    const customerId = this.config.get<string>('MESSAGECENTRAL_CUSTOMER_ID')?.trim();
    const authToken = this.config.get<string>('MESSAGECENTRAL_AUTH_TOKEN')?.trim();
    if (!customerId || !authToken) return null;
    return {
      customerId,
      authToken,
      country: this.config.get<string>('MESSAGECENTRAL_COUNTRY')?.trim() || '91',
      base: (this.config.get<string>('MESSAGECENTRAL_BASE_URL')?.trim() || 'https://cpaas.messagecentral.com').replace(
        /\/$/,
        '',
      ),
    };
  }

  private async sendMessageCentral(ten: string) {
    const cfg = this.messageCentralConfig();
    if (!cfg) return { ok: false as const };
    const params = new URLSearchParams({
      countryCode: cfg.country,
      flowType: 'SMS',
      mobileNumber: ten,
      otpLength: '6',
      customerId: cfg.customerId,
    });
    try {
      const res = await fetch(`${cfg.base}/verification/v3/send?${params.toString()}`, {
        method: 'POST',
        headers: { accept: '*/*', authToken: cfg.authToken },
      });
      const raw = await readBody(res);
      const body = JSON.parse(raw || '{}') as {
        responseCode?: number | string;
        message?: string;
        data?: { verificationId?: string; responseCode?: number | string; errorMessage?: string | null };
      };
      const verificationId = body.data?.verificationId?.trim();
      const ok =
        (Number(body.responseCode) === 200 || Number(body.data?.responseCode) === 200) && Boolean(verificationId);
      if (!ok) {
        const detail = body.data?.errorMessage || body.message || raw.slice(0, 180);
        this.logger.warn(`Message Central send failed for ${ten}: ${detail}`);
        return { ok: false as const, error: `message-central ${detail}` };
      }
      this.logger.log(`Message Central OTP sent to ${ten} verificationId=${verificationId}`);
      return { ok: true as const, verificationId };
    } catch (e) {
      return { ok: false as const, error: `message-central ${e instanceof Error ? e.message : 'error'}` };
    }
  }

  async validateMessageCentral(verificationId: string, code: string, mobile: string) {
    const cfg = this.messageCentralConfig();
    if (!cfg) return false;
    const ten = e164In(mobile).ten;
    const params = new URLSearchParams({
      countryCode: cfg.country,
      mobileNumber: ten,
      verificationId,
      customerId: cfg.customerId,
      code,
    });
    try {
      const res = await fetch(`${cfg.base}/verification/v3/validateOtp?${params.toString()}`, {
        method: 'GET',
        headers: { accept: '*/*', authToken: cfg.authToken },
      });
      const raw = await readBody(res);
      const body = JSON.parse(raw || '{}') as {
        responseCode?: number | string;
        data?: { verificationStatus?: string; responseCode?: number | string };
      };
      const status = body.data?.verificationStatus || '';
      const ok = status === 'VERIFICATION_COMPLETED';
      if (!ok) {
        this.logger.warn(`Message Central validate failed for ${ten}: ${raw.slice(0, 180)}`);
      }
      return ok;
    } catch (e) {
      this.logger.warn(`Message Central validate error: ${e instanceof Error ? e.message : 'error'}`);
      return false;
    }
  }

  private async sendWhatsAppCloud(wa: string, otp: string, message: string) {
    const token = this.config.get<string>('WHATSAPP_TOKEN');
    const phoneId = this.config.get<string>('WHATSAPP_PHONE_NUMBER_ID');
    if (!token || !phoneId) return { ok: false as const };
    const template = this.config.get<string>('WHATSAPP_OTP_TEMPLATE');
    const payload = template
      ? {
          messaging_product: 'whatsapp',
          to: wa,
          type: 'template',
          template: {
            name: template,
            language: { code: this.config.get<string>('WHATSAPP_OTP_TEMPLATE_LANG') ?? 'en' },
            components: [
              { type: 'body', parameters: [{ type: 'text', text: otp }] },
            ],
          },
        }
      : {
          messaging_product: 'whatsapp',
          to: wa,
          type: 'text',
          text: { preview_url: false, body: message },
        };
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return { ok: false as const, error: `whatsapp-cloud ${res.status} ${await readBody(res)}` };
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: `whatsapp-cloud ${e instanceof Error ? e.message : 'error'}` };
    }
  }

  private async sendGreenApi(wa: string, message: string) {
    const id = this.config.get<string>('GREEN_API_INSTANCE_ID');
    const token = this.config.get<string>('GREEN_API_TOKEN');
    if (!id || !token) return { ok: false as const };
    const host = this.config.get<string>('GREEN_API_URL') ?? 'https://api.green-api.com';
    try {
      const res = await fetch(`${host}/waInstance${id}/sendMessage/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: `${wa}@c.us`, message }),
      });
      if (!res.ok) return { ok: false as const, error: `green-api ${res.status} ${await readBody(res)}` };
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: `green-api ${e instanceof Error ? e.message : 'error'}` };
    }
  }

  private async sendTwoFactor(ten: string, otp: string, mode: 'sms' | 'whatsapp') {
    const key = this.config.get<string>('TWOFACTOR_API_KEY');
    if (!key) return { ok: false as const };
    const path = mode === 'whatsapp' ? 'WHATSAPP' : 'SMS';
    const template = this.config.get<string>('TWOFACTOR_TEMPLATE') ?? 'OTP1';
    try {
      const res = await fetch(`https://2factor.in/API/V1/${key}/${path}/${ten}/${otp}/${template}`);
      const body = await readBody(res);
      if (!res.ok) return { ok: false as const, error: `2factor ${res.status} ${body}` };
      try {
        const json = JSON.parse(body) as { Status?: string; Details?: string };
        if (json.Status && json.Status.toLowerCase() !== 'success') {
          return { ok: false as const, error: `2factor ${json.Details || json.Status}` };
        }
      } catch {
        /* some 2Factor responses are not JSON */
      }
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: `2factor ${e instanceof Error ? e.message : 'error'}` };
    }
  }

  private fast2SmsHeaders(key: string) {
    return { authorization: key, Accept: 'application/json' };
  }

  private parseFast2SmsError(body: string) {
    try {
      const json = JSON.parse(body) as {
        return?: boolean;
        success?: boolean;
        status?: boolean;
        message?: string | string[];
        errors?: Record<string, string[]>;
      };
      if (json.errors) {
        const parts = Object.values(json.errors).flat();
        if (parts.length) return parts.join(', ');
      }
      if (json.message) return Array.isArray(json.message) ? json.message.join(', ') : json.message;
    } catch {
      /* ignore */
    }
    return body.slice(0, 300);
  }

  private pickFast2SmsOtpTemplate(rows: Array<Record<string, unknown>>) {
    const approved = rows.filter((row) => {
      const status = String(row.status ?? row.template_status ?? row.approval_status ?? '').toLowerCase();
      return !status || status.includes('approv') || status === 'active';
    });
    const pool = approved.length ? approved : rows;
    const otpLike = pool.find((row) => {
      const blob = `${row.name ?? ''} ${row.template_name ?? ''} ${row.category ?? ''} ${row.message ?? ''}`.toLowerCase();
      return /otp|auth|verif|passcode/.test(blob);
    });
    const chosen = otpLike ?? pool[0];
    if (!chosen) return undefined;
    const id = chosen.message_id ?? chosen.id ?? chosen.template_id;
    return id != null && String(id).length ? String(id) : undefined;
  }

  private async loadFast2SmsWaba(key: string): Promise<Fast2SmsWaba> {
    if (this.fast2SmsWaba && Date.now() - this.fast2SmsWaba.at < 5 * 60 * 1000) {
      return this.fast2SmsWaba.value;
    }
    const value: Fast2SmsWaba = {
      phoneNumberId: this.config.get<string>('FAST2SMS_WA_PHONE_NUMBER_ID') || undefined,
      displayNumber: this.config.get<string>('FAST2SMS_WA_DISPLAY_NUMBER') || undefined,
      messageId: this.config.get<string>('FAST2SMS_WA_MESSAGE_ID') || undefined,
    };
    try {
      const [numbersRes, templatesRes] = await Promise.all([
        fetch('https://www.fast2sms.com/dev/dlt_manager/whatsapp?type=number', {
          headers: this.fast2SmsHeaders(key),
        }),
        fetch('https://www.fast2sms.com/dev/dlt_manager/whatsapp?type=template', {
          headers: this.fast2SmsHeaders(key),
        }),
      ]);
      if (numbersRes.ok) {
        const json = (await numbersRes.json()) as { data?: Array<Record<string, unknown>> };
        const number = json.data?.[0];
        if (number) {
          value.phoneNumberId = value.phoneNumberId || String(number.phone_number_id ?? '');
          value.displayNumber = value.displayNumber || String(number.number ?? '');
        }
      }
      if (!value.messageId && templatesRes.ok) {
        const json = (await templatesRes.json()) as { data?: Array<Record<string, unknown>> };
        value.messageId = this.pickFast2SmsOtpTemplate(json.data ?? []);
      }
    } catch (e) {
      this.logger.warn(`fast2sms waba lookup failed: ${e instanceof Error ? e.message : 'error'}`);
    }
    if (!value.phoneNumberId) delete value.phoneNumberId;
    if (!value.displayNumber) delete value.displayNumber;
    if (!value.messageId) delete value.messageId;
    this.fast2SmsWaba = { at: Date.now(), value };
    return value;
  }

  private async sendFast2SmsWhatsApp(wa: string, ten: string, otp: string, message: string) {
    const key = this.config.get<string>('FAST2SMS_API_KEY');
    if (!key) return { ok: false as const };
    const waba = await this.loadFast2SmsWaba(key);
    if (waba.phoneNumberId && waba.messageId) {
      const params = new URLSearchParams({
        message_id: waba.messageId,
        phone_number_id: waba.phoneNumberId,
        numbers: ten,
        variables_values: otp,
      });
      try {
        const res = await fetch(`https://www.fast2sms.com/dev/whatsapp?${params.toString()}`, {
          headers: this.fast2SmsHeaders(key),
        });
        const body = await readBody(res);
        if (res.ok && !/invalid|not approved|not connected|failed/i.test(body)) {
          try {
            const json = JSON.parse(body) as { return?: boolean; success?: boolean; status?: boolean };
            if (json.return !== false && json.success !== false && json.status !== false) {
              return { ok: true as const };
            }
          } catch {
            return { ok: true as const };
          }
        }
        this.logger.warn(`fast2sms whatsapp template: ${this.parseFast2SmsError(body)}`);
      } catch (e) {
        this.logger.warn(`fast2sms whatsapp template ${e instanceof Error ? e.message : 'error'}`);
      }
    }

    if (waba.phoneNumberId || waba.displayNumber) {
      const params = new URLSearchParams({ to: wa });
      if (waba.phoneNumberId) params.set('phone_number_id', waba.phoneNumberId);
      if (waba.displayNumber) params.set('display_number', waba.displayNumber);
      try {
        const res = await fetch(`https://www.fast2sms.com/dev/whatsapp-session?${params.toString()}`, {
          method: 'POST',
          headers: { ...this.fast2SmsHeaders(key), 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'text', text: message }),
        });
        const body = await readBody(res);
        if (res.ok) {
          try {
            const json = JSON.parse(body) as { return?: boolean; success?: boolean; status?: boolean };
            if (json.return !== false && json.success !== false && json.status !== false) {
              return { ok: true as const };
            }
          } catch {
            return { ok: true as const };
          }
        }
        return { ok: false as const, error: `fast2sms-wa ${this.parseFast2SmsError(body)}` };
      } catch (e) {
        return { ok: false as const, error: `fast2sms-wa ${e instanceof Error ? e.message : 'error'}` };
      }
    }

    return {
      ok: false as const,
      error:
        'fast2sms-wa WhatsApp number not connected. In Fast2SMS open WhatsApp Business, connect WABA, then approve an OTP template.',
    };
  }

  private async sendSmsHorizon(ten: string, message: string) {
    const key = this.config.get<string>('SMSHORIZON_API_KEY')?.trim();
    const user = this.config.get<string>('SMSHORIZON_USER')?.trim();
    if (!key || !user) return { ok: false as const };
    const sender = this.config.get<string>('SMSHORIZON_SENDER')?.trim() || 'HORIZN';
    const body = new URLSearchParams({
      user,
      mobile: ten,
      senderid: sender,
      message,
      type: 'txt',
    });
    try {
      const res = await fetch('https://smshorizon.co.in/api/v2/sendsms.php', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body,
      });
      const text = await readBody(res);
      let json: { msgid?: string | number; error?: string; mobile?: string; route?: string } = {};
      try {
        json = JSON.parse(text) as typeof json;
      } catch {
        /* ignore */
      }
      if (!res.ok || !json.msgid) {
        return { ok: false as const, error: `smshorizon ${res.status} ${json.error || text.slice(0, 300)}` };
      }
      const dlr = await this.readSmsHorizonStatus(key, user, String(json.msgid));
      if (dlr.failed) {
        return {
          ok: false as const,
          error: `smshorizon ${dlr.status} ${dlr.error || 'operator rejected the SMS'}`,
        };
      }
      this.logger.log(`SmsHorizon msgid ${json.msgid} route ${json.route || dlr.route || ''} status ${dlr.status}`);
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: `smshorizon ${e instanceof Error ? e.message : 'error'}` };
    }
  }

  private async readSmsHorizonStatus(key: string, user: string, msgid: string) {
    const failed = new Set(['REJECTD', 'UNDELIV', 'EXPIRED', 'DELETED', 'FAILED', 'UNKNOWN']);
    let last = { status: 'PENDING', error: '', route: '', failed: false };
    for (const wait of [400, 800, 1500]) {
      await new Promise((resolve) => setTimeout(resolve, wait));
      try {
        const res = await fetch('https://smshorizon.co.in/api/v2/status.php', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body: new URLSearchParams({ user, msgid }),
        });
        const json = JSON.parse(await readBody(res)) as {
          status?: string;
          error_desc?: string;
          error_code?: string;
          route?: string;
        };
        const status = String(json.status || 'PENDING').toUpperCase();
        last = {
          status,
          error: [json.error_code, json.error_desc].filter(Boolean).join(' '),
          route: json.route || '',
          failed: failed.has(status),
        };
        if (status === 'DELIVRD' || last.failed) return last;
      } catch {
        /* keep last */
      }
    }
    return last;
  }

  private async sendMsg91(ten: string, otp: string) {
    const authkey = this.config.get<string>('MSG91_AUTHKEY')?.trim();
    if (!authkey) return { ok: false as const };
    const templateId = this.config.get<string>('MSG91_TEMPLATE_ID')?.trim();
    const sender = this.config.get<string>('MSG91_SENDER')?.trim();
    const params = new URLSearchParams({
      mobile: `91${ten}`,
      otp,
      otp_length: '6',
      otp_expiry: '5',
      realTimeResponse: '1',
    });
    if (templateId) params.set('template_id', templateId);
    if (sender) params.set('sender', sender);
    try {
      const res = await fetch(`https://control.msg91.com/api/v5/otp?${params.toString()}`, {
        method: 'POST',
        headers: {
          authkey,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ OTP: otp, otp }),
      });
      const body = await readBody(res);
      let json: { type?: string; message?: string; code?: string | number } = {};
      try {
        json = JSON.parse(body) as typeof json;
      } catch {
        /* ignore */
      }
      if (json.type === 'success') return { ok: true as const };
      const err = json.message || String(json.code ?? '') || body.slice(0, 300);
      return { ok: false as const, error: `msg91 ${res.status} ${err}`.trim() };
    } catch (e) {
      return { ok: false as const, error: `msg91 ${e instanceof Error ? e.message : 'error'}` };
    }
  }

  private async sendFast2Sms(ten: string, otp: string, message: string) {
    const key = this.config.get<string>('FAST2SMS_API_KEY');
    if (!key) return { ok: false as const };
    const otpSend = await this.postFast2Sms(key, { route: 'otp', variables_values: otp, numbers: ten, flash: 0 });
    if (otpSend.ok) return otpSend;
    const quickSend = await this.postFast2Sms(key, {
      route: 'q',
      message,
      language: 'english',
      flash: 0,
      numbers: ten,
    });
    if (quickSend.ok) return quickSend;
    const error = [otpSend.error, quickSend.error].filter(Boolean).join(' | ');
    return { ok: false as const, error: error || 'fast2sms failed' };
  }

  private async postFast2Sms(key: string, payload: Record<string, string | number>) {
    try {
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: { authorization: key, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await readBody(res);
      const parsedError = this.parseFast2SmsError(body);
      if (!res.ok) return { ok: false as const, error: `fast2sms ${payload.route} ${res.status} ${parsedError}` };
      try {
        const json = JSON.parse(body) as { return?: boolean; message?: string | string[] };
        if (json.return === false) {
          return { ok: false as const, error: `fast2sms ${payload.route} ${parsedError}` };
        }
      } catch {
        /* ignore parse */
      }
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: `fast2sms ${payload.route} ${e instanceof Error ? e.message : 'error'}` };
    }
  }

  private async sendTextBee(e164: string, message: string) {
    const key = this.config.get<string>('TEXTBEE_API_KEY');
    const deviceId = this.config.get<string>('TEXTBEE_DEVICE_ID');
    if (!key || !deviceId) return { ok: false as const };
    try {
      const res = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key },
        body: JSON.stringify({ recipients: [e164], message }),
      });
      if (!res.ok) return { ok: false as const, error: `textbee ${res.status} ${await readBody(res)}` };
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: `textbee ${e instanceof Error ? e.message : 'error'}` };
    }
  }

  private async sendTextBelt(e164: string, message: string) {
    const key = this.config.get<string>('TEXTBELT_API_KEY');
    if (!key) return { ok: false as const };
    try {
      const res = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164, message, key }),
      });
      const body = await readBody(res);
      if (!res.ok) return { ok: false as const, error: `textbelt ${res.status} ${body}` };
      try {
        const json = JSON.parse(body) as { success?: boolean; error?: string };
        if (!json.success) return { ok: false as const, error: `textbelt ${json.error || 'failed'}` };
      } catch {
        return { ok: false as const, error: `textbelt ${body}` };
      }
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: `textbelt ${e instanceof Error ? e.message : 'error'}` };
    }
  }
}

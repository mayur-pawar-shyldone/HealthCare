import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../../shared/wallet.service';
import { OtpDeliveryService } from '../../shared/otp-delivery.service';
import {
  AliasSendOtpDto,
  AliasVerifyOtpDto,
  FirebaseOtpDto,
  ForgotPasswordDto,
  LoginDto,
  OtpPurpose,
  ResetPasswordDto,
  SendOtpDto,
  SignupDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { NotificationType } from '@prisma/client';

function durationToMs(value: string | undefined, fallbackMs: number) {
  if (!value) return fallbackMs;
  const match = /^(\d+)\s*([smhd])$/i.exec(value.trim());
  if (!match) return fallbackMs;
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  const map: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * (map[unit] ?? fallbackMs);
}

function maskMobile(mobile: string) {
  return mobile.replace(/^(\d{2})\d{4}(\d{4})$/, '$1****$2');
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private wallet: WalletService,
    private otpDelivery: OtpDeliveryService,
  ) {}

  async signup(dto: SignupDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException({
        message: 'Passwords do not match',
        error: 'PASSWORD_MISMATCH',
      });
    }
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email.toLowerCase() }, { mobile: dto.mobile }] },
    });
    if (existing) {
      throw new ConflictException({
        message: 'Email or mobile is already registered',
        error: 'DUPLICATE_ACCOUNT',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const referrer = dto.referralCode ? await this.wallet.resolveReferrer(dto.referralCode) : null;
    if (dto.referralCode?.trim() && !referrer) {
      throw new BadRequestException({
        message: 'Invalid referral code',
        error: 'INVALID_REFERRAL_CODE',
      });
    }

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName.trim(),
        email: dto.email.toLowerCase(),
        mobile: dto.mobile,
        passwordHash,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        referredByUserId: referrer?.id,
        profile: { create: {} },
        wallet: { create: {} },
        notifications: {
          create: {
            type: NotificationType.PROMOTIONAL,
            title: 'Welcome to HealthID Card',
            body: referrer
              ? 'Account created. Activate your free HealthID Card to unlock member rates and ₹250 joining bonus.'
              : 'Your account is ready. Activate your free HealthID Card and get ₹250 wallet bonus.',
          },
        },
      },
    });

    await this.wallet.assignReferralCode(user.id, user.fullName);

    return {
      message: 'Account created. Please log in to continue.',
      email: user.email,
    };
  }

  async login(dto: LoginDto, userAgent?: string) {
    const identifier = dto.identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email: identifier }, { mobile: dto.identifier.trim() }],
      },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
        error: 'INVALID_CREDENTIALS',
      });
    }
    if (!user.isActive) {
      throw new UnauthorizedException({
        message: 'Account is deactivated',
        error: 'ACCOUNT_INACTIVE',
      });
    }
    return this.issueTokens(user.id, user.email, user.role, user.fullName, user.mobile, userAgent);
  }

  async refresh(refreshToken: string, userAgent?: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; typ: string }>(refreshToken, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      });
      if (payload.typ !== 'refresh') throw new Error('bad');
      const tokenHash = this.hash(refreshToken);
      const stored = await this.prisma.refreshToken.findFirst({
        where: { tokenHash, userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } },
      });
      if (!stored) throw new Error('missing');
      await this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      });
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
      return this.issueTokens(user.id, user.email, user.role, user.fullName, user.mobile, userAgent);
    } catch {
      throw new UnauthorizedException({
        message: 'Session expired. Please sign in again.',
        error: 'REFRESH_FAILED',
      });
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash: this.hash(refreshToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { message: 'Logged out' };
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { message: 'Logged out from all devices' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const identifier = dto.identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { mobile: dto.identifier.trim() }] },
    });
    if (!user) {
      return { message: 'If an account exists, a reset token has been issued.' };
    }
    const raw = randomBytes(24).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hash(raw),
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });
    return {
      message: 'If an account exists, a reset token has been issued.',
      resetToken: process.env.NODE_ENV === 'production' ? undefined : raw,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const token = await this.prisma.passwordResetToken.findFirst({
      where: { tokenHash: this.hash(dto.token), usedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!token) {
      throw new BadRequestException({ message: 'Invalid or expired reset token', error: 'RESET_INVALID' });
    }
    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: token.userId }, data: { passwordHash } }),
      this.prisma.passwordResetToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
      this.prisma.refreshToken.updateMany({
        where: { userId: token.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { message: 'Password updated. Please sign in.' };
  }

  async sessions(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      select: { id: true, userAgent: true, createdAt: true, expiresAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendOtpAlias(dto: AliasSendOtpDto) {
    return this.sendOtp({
      mobile: dto.mobile.trim(),
      purpose: dto.purpose ?? OtpPurpose.login,
      fullName: dto.fullName,
    });
  }

  async verifyOtpAlias(dto: AliasVerifyOtpDto, userAgent?: string) {
    return this.verifyOtp(
      {
        mobile: dto.mobile.trim(),
        otp: dto.otp,
        purpose: dto.purpose ?? OtpPurpose.login,
        fullName: dto.fullName,
      },
      userAgent,
    );
  }

  async sendOtp(dto: SendOtpDto) {
    const mobile = dto.mobile.trim();
    const purpose = dto.purpose;
    const fullName = dto.fullName?.trim();

    if (purpose === OtpPurpose.signup && (!fullName || fullName.length < 2)) {
      throw new BadRequestException({
        message: 'Enter the name for this account.',
        error: 'NAME_REQUIRED',
      });
    }

    const existing = await this.prisma.user.findFirst({
      where: { mobile, deletedAt: null },
    });

    if (purpose === OtpPurpose.login) {
      if (!existing) {
        throw new BadRequestException({
          message: 'No account found for this mobile. Create an account.',
          error: 'ACCOUNT_NOT_FOUND',
        });
      }
      if (!existing.isActive) {
        throw new UnauthorizedException({
          message: 'Account is deactivated',
          error: 'ACCOUNT_INACTIVE',
        });
      }
    }

    if (purpose === OtpPurpose.signup && existing) {
      throw new ConflictException({
        message: 'This mobile is already registered. Please log in.',
        error: 'DUPLICATE_ACCOUNT',
      });
    }

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const sentLastHour = await this.prisma.otpChallenge.count({
      where: { mobile, createdAt: { gt: hourAgo } },
    });
    if (sentLastHour >= 8) {
      throw new HttpException(
        { message: 'Too many OTP requests. Try again later.', error: 'OTP_RATE_LIMIT' },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const last = await this.prisma.otpChallenge.findFirst({
      where: { mobile },
      orderBy: { createdAt: 'desc' },
    });
    if (last && Date.now() - last.createdAt.getTime() < 30_000) {
      throw new HttpException(
        { message: 'Please wait before requesting another OTP.', error: 'OTP_COOLDOWN' },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const useMc = this.otpDelivery.isMessageCentralEnabled();
    const useFirebase = !useMc && this.firebaseEnabled();
    const otp = useFirebase ? 'firebase' : String(randomInt(100000, 1000000));

    if (useFirebase) {
      await this.prisma.otpChallenge.updateMany({
        where: { mobile, purpose, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      await this.prisma.otpChallenge.create({
        data: {
          mobile,
          purpose,
          fullName: fullName || existing?.fullName || null,
          codeHash: this.hash(otp),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
      return {
        sent: true,
        delivered: true,
        channel: 'sms' as const,
        maskedMobile: maskMobile(mobile),
      };
    }

    try {
      const delivered = await this.otpDelivery.send(mobile, otp);
      const codeHash = delivered.verificationId
        ? `mc:${delivered.verificationId}`.slice(0, 64)
        : this.hash(otp);
      const ttlMs = delivered.verificationId ? 90 * 1000 : 5 * 60 * 1000;
      await this.prisma.otpChallenge.updateMany({
        where: { mobile, purpose, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      await this.prisma.otpChallenge.create({
        data: {
          mobile,
          purpose,
          fullName: fullName || existing?.fullName || null,
          codeHash,
          expiresAt: new Date(Date.now() + ttlMs),
        },
      });
      const showDevCode = this.config.get('NODE_ENV') !== 'production' && !delivered.delivered;
      if (this.config.get('NODE_ENV') !== 'production') {
        this.logger.log(
          delivered.verificationId
            ? `OTP for ${mobile} via Message Central verificationId=${delivered.verificationId}`
            : `OTP for ${mobile}: ${otp} via ${delivered.channel}${delivered.delivered ? '' : ' (not sent to phone)'}`,
        );
      }
      return {
        sent: true,
        delivered: delivered.delivered,
        channel: delivered.channel,
        maskedMobile: maskMobile(mobile),
        devCode: showDevCode ? otp : undefined,
      };
    } catch {
      throw new ServiceUnavailableException({
        message: 'Could not send OTP right now. Please try again.',
        error: 'OTP_DELIVERY_FAILED',
      });
    }
  }

  async verifyOtp(dto: VerifyOtpDto, userAgent?: string) {
    const mobile = dto.mobile.trim();
    const otp = dto.otp.trim();
    const purpose = dto.purpose;
    const challenge = await this.prisma.otpChallenge.findFirst({
      where: { mobile, purpose, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!challenge) {
      throw new BadRequestException({
        message: 'OTP expired or not found. Request a new one.',
        error: 'OTP_EXPIRED',
      });
    }

    if (challenge.attempts >= 5) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { consumedAt: new Date() },
      });
      throw new BadRequestException({
        message: 'Too many incorrect attempts. Request a new OTP.',
        error: 'OTP_LOCKED',
      });
    }

    const matches = challenge.codeHash.startsWith('mc:')
      ? await this.otpDelivery.validateMessageCentral(challenge.codeHash.slice(3), otp, mobile)
      : this.otpHashMatches(challenge.codeHash, otp);
    if (!matches) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException({
        message: 'Incorrect OTP. Please try again.',
        error: 'OTP_INVALID',
      });
    }

    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });

    return this.completeOtpAuth(mobile, purpose, dto.fullName || challenge.fullName, userAgent);
  }

  async verifyFirebaseOtp(dto: FirebaseOtpDto, userAgent?: string) {
    const apiKey = this.config.get<string>('FIREBASE_WEB_API_KEY')?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException({
        message: 'Firebase Phone Auth is not configured.',
        error: 'FIREBASE_NOT_CONFIGURED',
      });
    }
    const mobile = dto.mobile.trim();
    let phone = '';
    try {
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: dto.idToken }),
      });
      const body = (await res.json()) as { users?: Array<{ phoneNumber?: string }>; error?: { message?: string } };
      phone = body.users?.[0]?.phoneNumber || '';
      if (!res.ok || !phone) {
        throw new UnauthorizedException({
          message: body.error?.message || 'Firebase OTP is invalid.',
          error: 'OTP_INVALID',
        });
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException({
        message: 'Could not verify Firebase OTP.',
        error: 'OTP_INVALID',
      });
    }
    const ten = phone.replace(/\D/g, '').slice(-10);
    if (ten !== mobile) {
      throw new BadRequestException({
        message: 'Mobile number does not match the OTP.',
        error: 'OTP_INVALID',
      });
    }

    const challenge = await this.prisma.otpChallenge.findFirst({
      where: { mobile, purpose: dto.purpose, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!challenge) {
      throw new BadRequestException({
        message: 'OTP expired or not found. Request a new one.',
        error: 'OTP_EXPIRED',
      });
    }
    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });
    return this.completeOtpAuth(mobile, dto.purpose, dto.fullName || challenge.fullName, userAgent);
  }

  private firebaseEnabled() {
    return Boolean(this.config.get<string>('FIREBASE_WEB_API_KEY')?.trim());
  }

  private otpHashMatches(codeHash: string, otp: string) {
    const expected = Buffer.from(codeHash);
    const actual = Buffer.from(this.hash(otp));
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }

  private async completeOtpAuth(mobile: string, purpose: OtpPurpose, name: string | null | undefined, userAgent?: string) {
    if (purpose === OtpPurpose.guest || purpose === OtpPurpose.lookup) {
      return { verified: true, mobile };
    }

    const fullName = (name || '').trim();
    let user = await this.prisma.user.findFirst({
      where: { mobile, deletedAt: null },
    });

    if (purpose === OtpPurpose.login) {
      if (!user) {
        throw new BadRequestException({
          message: 'No account found for this mobile. Create an account.',
          error: 'ACCOUNT_NOT_FOUND',
        });
      }
      if (!user.isActive) {
        throw new UnauthorizedException({
          message: 'Account is deactivated',
          error: 'ACCOUNT_INACTIVE',
        });
      }
    } else {
      if (!fullName || fullName.length < 2) {
        throw new BadRequestException({
          message: 'Enter the name for this account.',
          error: 'NAME_REQUIRED',
        });
      }
      if (!user) {
        user = await this.createOtpUser(fullName, mobile);
      }
    }

    const session = await this.issueTokens(
      user.id,
      user.email,
      user.role,
      user.fullName,
      user.mobile,
      userAgent,
    );
    return { verified: true, ...session };
  }

  private async createOtpUser(fullName: string, mobile: string) {
    const passwordHash = await bcrypt.hash(randomBytes(24).toString('hex'), 10);
    const user = await this.prisma.user.create({
      data: {
        fullName,
        email: `otp.${mobile}@healthidcard.local`,
        mobile,
        passwordHash,
        profile: { create: {} },
        wallet: { create: {} },
        notifications: {
          create: {
            type: NotificationType.PROMOTIONAL,
            title: 'Welcome to HealthID Card',
            body: 'Your account is ready. Your HealthID Card is linked to this mobile number.',
          },
        },
      },
    });
    await this.wallet.assignReferralCode(user.id, user.fullName);
    return user;
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: string,
    fullName: string,
    mobile: string,
    userAgent?: string,
  ) {
    const accessExpires = this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '365d';
    const accessToken = await this.jwt.signAsync(
      { sub: userId, email, role, typ: 'access' },
      {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: accessExpires as never,
      },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, typ: 'refresh' },
      {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpires as never,
      },
    );
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hash(refreshToken),
        userAgent,
        expiresAt: new Date(Date.now() + durationToMs(refreshExpires, 365 * 24 * 60 * 60 * 1000)),
      },
    });
    return {
      accessToken,
      refreshToken,
      user: { id: userId, email, role, fullName, mobile },
    };
  }

  private hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }
}

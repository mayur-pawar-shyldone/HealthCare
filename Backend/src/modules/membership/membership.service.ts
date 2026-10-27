import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Gender, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletService } from '../../shared/wallet.service';
import { WhatsAppService } from '../../shared/whatsapp.service';
import { AuthService } from '../auth/auth.service';
import { OtpPurpose } from '../auth/dto/auth.dto';

@Injectable()
export class MembershipService {
  constructor(
    private prisma: PrismaService,
    private whatsapp: WhatsAppService,
    private wallet: WalletService,
    private auth: AuthService,
  ) {}

  plans() {
    return this.prisma.membershipPlan.findMany({
      where: { isActive: true },
      include: { benefits: { include: { test: true } } },
      orderBy: [{ isFree: 'desc' }, { price: 'asc' }],
    });
  }

  async current(userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, isActive: true, expiresAt: { gt: new Date() } },
      include: {
        plan: { include: { benefits: { include: { test: true } } } },
        usage: { include: { test: true }, orderBy: { usedAt: 'desc' } },
        members: { include: { familyMember: true } },
      },
    });
    return membership;
  }

  async card(userId: string) {
    const membership = await this.current(userId);
    if (!membership) throw new NotFoundException({ message: 'No active membership', error: 'NO_MEMBERSHIP' });
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return {
      brand: 'HEALTH ID CARD',
      title: 'Family Health Card',
      memberName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      membershipId: membership.number,
      validFrom: membership.startsAt,
      validUntil: membership.expiresAt,
      plan: membership.plan.name,
      flatDiscountPercent: Number(membership.plan.flatDiscountPercent),
      maxFamilyMembers: membership.plan.maxFamilyMembers,
      familyMembers: membership.members.map((m) => ({
        id: m.isPrimary ? 'self' : m.familyMemberId || m.id,
        name: m.name,
        relation: m.relation,
        isPrimary: m.isPrimary,
      })),
      qrPayload: JSON.stringify({
        v: 2,
        id: membership.number,
        name: user.fullName,
        valid: membership.expiresAt.toISOString().slice(0, 10),
      }),
    };
  }

  benefits(userId: string) {
    return this.current(userId).then((m) => m?.plan.benefits ?? []);
  }

  async subscribe(userId: string, planId: string) {
    const plan = await this.prisma.membershipPlan.findFirst({ where: { id: planId, isActive: true } });
    if (!plan) throw new BadRequestException({ message: 'Invalid plan', error: 'INVALID_PLAN' });
    const existing = await this.current(userId);
    if (existing) {
      throw new BadRequestException({ message: 'You already have an active membership', error: 'ALREADY_MEMBER' });
    }

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, fullName: true, referredByUserId: true },
    });
    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + plan.durationDays * 86400000);
    const number = `HIC-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString().slice(-6)}`;

    const membership = await this.prisma.membership.create({
      data: {
        userId,
        planId: plan.id,
        number,
        startsAt,
        expiresAt,
        members: {
          create: {
            name: user.fullName,
            relation: 'Self',
            isPrimary: true,
          },
        },
      },
      include: { plan: { include: { benefits: true } }, members: true },
    });

    const family = await this.prisma.familyMember.findMany({ where: { userId } });
    for (const f of family.slice(0, plan.maxFamilyMembers - 1)) {
      await this.addFamilyToCard(userId, f.id, membership.id);
    }

    const priceText = plan.isFree ? 'FREE for 1 year' : `₹${Number(plan.price)}/year`;
    const body = `Your HealthID Card (${number}) is active until ${expiresAt.toDateString()}. ${priceText}. Enjoy ${Number(plan.flatDiscountPercent)}% off on all tests + free home collection.`;
    await this.prisma.notification.create({
      data: {
        userId,
        type: NotificationType.PROMOTIONAL,
        title: 'HealthID Card activated',
        body,
      },
    });
    await this.whatsapp.send(userId, 'membership_activated', body);

    await this.wallet.assignReferralCode(userId, user.fullName);
    await this.wallet.creditJoiningBonus(userId);

    if (user.referredByUserId) {
      await this.wallet.creditReferralBonus(user.referredByUserId, userId);
    }

    return membership;
  }

  async addFamilyToCard(userId: string, familyMemberId: string, membershipId?: string) {
    const membership =
      membershipId
        ? await this.prisma.membership.findFirst({ where: { id: membershipId, userId }, include: { plan: true } })
        : await this.current(userId);
    if (!membership) throw new BadRequestException({ message: 'No active membership', error: 'NO_MEMBERSHIP' });

    const family = await this.prisma.familyMember.findFirst({ where: { id: familyMemberId, userId } });
    if (!family) throw new NotFoundException({ message: 'Family member not found', error: 'NOT_FOUND' });

    const count = await this.prisma.membershipMember.count({ where: { membershipId: membership.id } });
    if (count >= membership.plan.maxFamilyMembers) {
      throw new BadRequestException({
        message: `Card supports up to ${membership.plan.maxFamilyMembers} members`,
        error: 'FAMILY_LIMIT',
      });
    }

    const existing = await this.prisma.membershipMember.findFirst({
      where: { membershipId: membership.id, familyMemberId },
    });
    if (existing) return existing;

    return this.prisma.membershipMember.create({
      data: {
        membershipId: membership.id,
        familyMemberId,
        name: family.name,
        relation: family.relation,
      },
    });
  }

  /** Accounts are HealthID Cards. Older signups never wrote a membership row, so issue the free card on first verify. */
  async ensureFreeCard(userId: string) {
    const memberInclude = { orderBy: [{ isPrimary: 'desc' as const }, { name: 'asc' as const }] };
    const current = await this.prisma.membership.findFirst({
      where: { userId, isActive: true, expiresAt: { gt: new Date() } },
      include: { members: memberInclude },
    });
    if (current) return current;

    const plan = await this.freePlan();
    const created = await this.subscribe(userId, plan.id);
    return this.prisma.membership.findUniqueOrThrow({
      where: { id: created.id },
      include: { members: memberInclude },
    });
  }

  private async freePlan() {
    const existing = await this.prisma.membershipPlan.findFirst({
      where: { isActive: true, isFree: true },
      orderBy: { createdAt: 'asc' },
    });
    if (existing) return existing;
    return this.prisma.membershipPlan.create({
      data: {
        name: 'HealthID Card',
        slug: 'health-id-card',
        price: 0,
        durationDays: 365,
        isFree: true,
        flatDiscountPercent: 30,
        maxFamilyMembers: 5,
        description: 'Free family HealthID Card for 1 year. Member rates and free home collection.',
      },
    });
  }

  async sendCardOtp(identifier: string) {
    const { mobile } = await this.resolveActiveCard(identifier);
    const sent = await this.auth.sendOtp({ mobile, purpose: OtpPurpose.login });
    return {
      sent: sent.sent,
      delivered: sent.delivered,
      channel: sent.channel,
      maskedMobile: sent.maskedMobile,
      devCode: sent.devCode,
    };
  }

  async issueFreeCard(input: {
    fullName: string;
    mobile: string;
    aadhaar: string;
    dateOfBirth: string;
    gender: Gender;
    email?: string;
    address: string;
    pincode: string;
    city?: string;
    state?: string;
  }) {
    const mobile = input.mobile.trim();
    const fullName = input.fullName.trim();
    const dob = parseCardDob(input.dateOfBirth);
    if (!dob) {
      throw new BadRequestException({
        message: 'Enter date of birth as dd-mm-yyyy.',
        error: 'INVALID_DOB',
      });
    }
    const email = input.email?.trim().toLowerCase() || undefined;
    const aadhaarLast4 = input.aadhaar.trim().slice(-4);
    const address = {
      line1: input.address.trim(),
      city: input.city?.trim() || 'Nashik',
      state: input.state?.trim() || 'Maharashtra',
      pincode: input.pincode.trim(),
      label: 'Home',
      isPrimary: true,
    };

    let user = await this.prisma.user.findFirst({ where: { mobile, deletedAt: null } });
    if (user && !user.isActive) {
      throw new BadRequestException({ message: 'This account is deactivated.', error: 'ACCOUNT_INACTIVE' });
    }
    if (email) {
      const taken = await this.prisma.user.findFirst({
        where: { email, deletedAt: null, ...(user ? { NOT: { id: user.id } } : {}) },
      });
      if (taken) {
        throw new BadRequestException({
          message: 'This email is already used by another account.',
          error: 'EMAIL_TAKEN',
        });
      }
    }

    if (!user) {
      const passwordHash = await bcrypt.hash(randomBytes(24).toString('hex'), 10);
      user = await this.prisma.user.create({
        data: {
          fullName,
          email: email || `otp.${mobile}@healthidcard.local`,
          mobile,
          passwordHash,
          dateOfBirth: dob,
          gender: input.gender,
          profile: { create: { aadhaarLast4 } },
          wallet: { create: {} },
          addresses: { create: address },
        },
      });
      await this.wallet.assignReferralCode(user.id, user.fullName);
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          fullName,
          dateOfBirth: dob,
          gender: input.gender,
          ...(email ? { email } : {}),
        },
      });
      await this.prisma.userProfile.upsert({
        where: { userId: user.id },
        update: { aadhaarLast4 },
        create: { userId: user.id, aadhaarLast4 },
      });
      const primary = await this.prisma.address.findFirst({ where: { userId: user.id, isPrimary: true } });
      if (primary) {
        await this.prisma.address.update({
          where: { id: primary.id },
          data: { line1: address.line1, city: address.city, state: address.state, pincode: address.pincode, label: address.label },
        });
      } else {
        await this.prisma.address.create({ data: { userId: user.id, ...address } });
      }
    }

    const membership = await this.ensureFreeCard(user.id);
    return {
      cardNumber: membership.number,
      memberName: fullName,
      maskedMobile: mobile.replace(/^(\d{2})\d{4}(\d{4})$/, '$1****$2'),
      validUntil: membership.expiresAt,
    };
  }

  async verifyCardOtp(identifier: string, otp: string, userAgent?: string) {
    const { mobile, membership } = await this.resolveActiveCard(identifier);
    const session = await this.auth.verifyOtp({ mobile, otp, purpose: OtpPurpose.login }, userAgent);
    const masked = mobile.replace(/^(\d{2})\d{4}(\d{4})$/, '$1****$2');
    return {
      ...session,
      maskedMobile: masked,
      members: membership.members.map((m) => ({
        id: m.isPrimary ? 'self' : m.familyMemberId || m.id,
        name: m.name,
        relation: m.relation,
        isPrimary: m.isPrimary,
      })),
    };
  }

  private async resolveActiveCard(identifier: string) {
    const raw = identifier.trim();
    if (raw.length < 4) {
      throw new BadRequestException({
        message: 'Enter your HealthID Card number or the mobile saved on that card.',
        error: 'CARD_REQUIRED',
      });
    }
    const digits = raw.replace(/\D/g, '');
    const asMobile = digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));

    if (asMobile) {
      const mobile = digits.slice(-10);
      const user = await this.prisma.user.findFirst({
        where: { mobile, deletedAt: null, isActive: true },
      });
      if (!user) {
        throw new NotFoundException({
          message: 'No HealthID Card is linked to this mobile.',
          error: 'CARD_NOT_FOUND',
        });
      }
      const membership = await this.ensureFreeCard(user.id);
      return { mobile: user.mobile, membership };
    }

    const membership = await this.prisma.membership.findFirst({
      where: { number: raw.toUpperCase(), isActive: true, expiresAt: { gt: new Date() } },
      include: { user: true, members: { orderBy: [{ isPrimary: 'desc' }, { name: 'asc' }] } },
    });
    if (!membership || membership.user.deletedAt || !membership.user.isActive) {
      throw new NotFoundException({
        message: 'No active HealthID Card found for this number.',
        error: 'CARD_NOT_FOUND',
      });
    }
    return { mobile: membership.user.mobile, membership };
  }

  async removeFromCard(userId: string, memberId: string) {
    const membership = await this.current(userId);
    if (!membership) throw new BadRequestException({ message: 'No active membership', error: 'NO_MEMBERSHIP' });
    const member = await this.prisma.membershipMember.findFirst({
      where: { id: memberId, membershipId: membership.id, isPrimary: false },
    });
    if (!member) throw new NotFoundException({ message: 'Cannot remove primary member', error: 'NOT_FOUND' });
    await this.prisma.membershipMember.delete({ where: { id: member.id } });
    return { message: 'Removed from card' };
  }
}

function parseCardDob(value: string) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  const today = new Date();
  if (date > today || year < 1900) return null;
  return date;
}

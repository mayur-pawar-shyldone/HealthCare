import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';
import type { Request } from 'express';
import { Gender } from '@prisma/client';
import { MembershipService } from './membership.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

class SubscribeDto {
  @IsString()
  planId: string;
}

class FamilyLinkDto {
  @IsString()
  familyMemberId: string;
}

class CardOtpDto {
  @IsString()
  @MinLength(4)
  identifier: string;
}

class CardOtpVerifyDto {
  @IsString()
  @MinLength(4)
  identifier: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}

class IssueFreeCardDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @Matches(/^[6-9]\d{9}$/)
  mobile: string;

  @Matches(/^\d{12}$/)
  aadhaar: string;

  @Matches(/^\d{2}-\d{2}-\d{4}$/)
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  address: string;

  @Matches(/^\d{6}$/)
  pincode: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}

@ApiTags('membership')
@Controller('membership')
export class MembershipController {
  constructor(private membership: MembershipService) {}

  @Public()
  @Get('plans')
  plans() {
    return this.membership.plans();
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('free-card')
  issueFreeCard(@Body() dto: IssueFreeCardDto) {
    return this.membership.issueFreeCard(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('card-otp')
  sendCardOtp(@Body() dto: CardOtpDto) {
    return this.membership.sendCardOtp(dto.identifier);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('card-otp/verify')
  verifyCardOtp(@Body() dto: CardOtpVerifyDto, @Req() req: Request) {
    return this.membership.verifyCardOtp(dto.identifier, dto.otp, req.headers['user-agent']);
  }

  @ApiBearerAuth()
  @Get()
  current(@CurrentUser() user: { id: string }) {
    return this.membership.current(user.id);
  }

  @ApiBearerAuth()
  @Get('card')
  card(@CurrentUser() user: { id: string }) {
    return this.membership.card(user.id);
  }

  @ApiBearerAuth()
  @Get('benefits')
  benefits(@CurrentUser() user: { id: string }) {
    return this.membership.benefits(user.id);
  }

  @ApiBearerAuth()
  @Post()
  subscribe(@CurrentUser() user: { id: string }, @Body() dto: SubscribeDto) {
    return this.membership.subscribe(user.id, dto.planId);
  }

  @ApiBearerAuth()
  @Post('family')
  addFamily(@CurrentUser() user: { id: string }, @Body() dto: FamilyLinkDto) {
    return this.membership.addFamilyToCard(user.id, dto.familyMemberId);
  }

  @ApiBearerAuth()
  @Delete('family/:id')
  removeFamily(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.membership.removeFromCard(user.id, id);
  }
}

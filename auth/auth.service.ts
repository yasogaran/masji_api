import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TenantService } from '../database/tenant.service';
import { PrismaService } from '../database/prisma.service';
import { LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

export interface JwtPayload {
  sub: string; // user id
  phone: string;
  dbName: string;
  permissions: string[];
}

@Injectable()
export class AuthService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_DURATION_MINUTES = 30;

  constructor(
    private jwtService: JwtService,
    private tenantService: TenantService,
  ) {}

  async login(loginDto: LoginDto, subdomain: string) {
    // Find tenant
    const tenant = await this.tenantService.findBySubdomain(subdomain);
    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant');
    }

    // Get tenant database
    const prisma = await this.tenantService.getClientForTenant(tenant);

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { phone: loginDto.phone },
      include: {
        person: true,
        permissions: {
          include: { permission: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / (1000 * 60),
      );
      throw new UnauthorizedException(
        `Account locked. Try again in ${minutesLeft} minutes.`,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      // Increment failed attempts
      const failedAttempts = user.failedAttempts + 1;
      const updateData: any = { failedAttempts };

      if (failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
        const lockedUntil = new Date();
        lockedUntil.setMinutes(lockedUntil.getMinutes() + this.LOCK_DURATION_MINUTES);
        updateData.lockedUntil = lockedUntil;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    // Generate JWT
    const permissions = user.permissions.map((up) => up.permission.code);
    const payload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      dbName: tenant.dbName,
      permissions,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        fullName: user.person.fullName,
        mustChangePassword: user.mustChangePassword,
        permissions,
      },
    };
  }

  async changePassword(
    userId: string,
    dbName: string,
    dto: ChangePasswordDto,
  ) {
    const tenant = await this.tenantService.findByDbName(dbName);
    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant');
    }

    const prisma = await this.tenantService.getClientForTenant(tenant);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto, subdomain: string) {
    const tenant = await this.tenantService.findBySubdomain(subdomain);
    if (!tenant) {
      throw new BadRequestException('Invalid tenant');
    }

    const prisma = await this.tenantService.getClientForTenant(tenant);
    const user = await prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user || !user.email) {
      // Don't reveal if user exists
      return { message: 'If the account exists, an OTP will be sent to the registered email' };
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // 10 minutes expiry

    // Save OTP
    await prisma.passwordResetRequest.create({
      data: {
        userId: user.id,
        resetType: 'email_otp',
        otpCode: otp,
        otpExpiresAt: otpExpiry,
      },
    });

    // TODO: Send OTP via email
    console.log(`OTP for ${user.email}: ${otp}`);

    return { message: 'If the account exists, an OTP will be sent to the registered email' };
  }

  async verifyOtpAndResetPassword(dto: ResetPasswordDto, subdomain: string) {
    const tenant = await this.tenantService.findBySubdomain(subdomain);
    if (!tenant) {
      throw new BadRequestException('Invalid tenant');
    }

    const prisma = await this.tenantService.getClientForTenant(tenant);

    // Find valid OTP
    const resetRequest = await prisma.passwordResetRequest.findFirst({
      where: {
        user: { phone: dto.phone },
        otpCode: dto.otp,
        isUsed: false,
        otpExpiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetRequest) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    // Update password and mark OTP as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRequest.userId },
        data: {
          passwordHash,
          mustChangePassword: false,
          passwordChangedAt: new Date(),
          failedAttempts: 0,
          lockedUntil: null,
        },
      }),
      prisma.passwordResetRequest.update({
        where: { id: resetRequest.id },
        data: { isUsed: true },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }

  async adminResetPassword(
    adminId: string,
    targetUserId: string,
    dbName: string,
  ) {
    const tenant = await this.tenantService.findByDbName(dbName);
    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant');
    }

    const prisma = await this.tenantService.getClientForTenant(tenant);

    // Generate temporary password
    const tempPassword = this.generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: targetUserId },
        data: {
          passwordHash,
          mustChangePassword: true,
          failedAttempts: 0,
          lockedUntil: null,
        },
      }),
      prisma.passwordResetRequest.create({
        data: {
          userId: targetUserId,
          resetType: 'admin_reset',
          resetBy: adminId,
          tempPassword: tempPassword, // Store for reference
        },
      }),
    ]);

    return {
      message: 'Password reset successfully',
      tempPassword,
    };
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async validateJwtPayload(payload: JwtPayload) {
    const tenant = await this.tenantService.findByDbName(payload.dbName);
    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant');
    }

    const prisma = await this.tenantService.getClientForTenant(tenant);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { person: true },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      ...user,
      tenant,
      prisma,
    };
  }
}


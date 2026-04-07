import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    // Find user by phone
    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        person: true,
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.status === 'locked') {
      if (user.lockedUntil && new Date() < user.lockedUntil) {
        throw new UnauthorizedException('Account is locked. Please try again later.');
      }
      // Unlock if lock period has passed
      await this.prisma.user.update({
        where: { id: user.id },
        data: { status: 'active', failedAttempts: 0, lockedUntil: null },
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      // Increment failed attempts
      const newFailedAttempts = user.failedAttempts + 1;
      
      if (newFailedAttempts >= 5) {
        // Lock account for 30 minutes
        const lockedUntil = new Date();
        lockedUntil.setMinutes(lockedUntil.getMinutes() + 30);
        
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            failedAttempts: newFailedAttempts,
            status: 'locked',
            lockedUntil,
          },
        });
        throw new UnauthorizedException('Account locked due to too many failed attempts');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: newFailedAttempts },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    // Generate JWT token
    const payload = {
      sub: user.id,
      phone: user.phone,
      personId: user.personId,
      permissions: user.permissions.map(p => p.permission.code),
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        mustChangePassword: user.mustChangePassword,
        person: {
          id: user.person.id,
          fullName: user.person.fullName,
        },
        permissions: user.permissions.map(p => p.permission.code),
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        mustChangePassword: false,
        passwordChangedAt: new Date(),
      },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user || !user.email) {
      // Don't reveal if user exists
      return { message: 'If the account exists with an email, an OTP will be sent' };
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 15);

    // Store OTP
    await this.prisma.passwordResetRequest.create({
      data: {
        userId: user.id,
        resetType: 'email_otp',
        otpCode,
        otpExpiresAt,
      },
    });

    // TODO: Send email with OTP
    // In development, log the OTP
    console.log(`OTP for ${phone}: ${otpCode}`);

    return { message: 'OTP sent to registered email' };
  }

  async verifyOtp(phone: string, otpCode: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new BadRequestException('Invalid request');
    }

    const resetRequest = await this.prisma.passwordResetRequest.findFirst({
      where: {
        userId: user.id,
        otpCode,
        isUsed: false,
        otpExpiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetRequest) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Generate a temporary token for password reset
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password_reset', requestId: resetRequest.id },
      { expiresIn: '15m' },
    );

    return { resetToken };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(resetToken);
      
      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid reset token');
      }

      // Mark OTP as used
      await this.prisma.passwordResetRequest.update({
        where: { id: payload.requestId },
        data: { isUsed: true },
      });

      // Hash and update password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: {
          passwordHash,
          mustChangePassword: false,
          passwordChangedAt: new Date(),
        },
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async adminResetPassword(adminId: string, targetUserId: string) {
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        passwordHash,
        mustChangePassword: true,
      },
    });

    // Log the reset
    await this.prisma.passwordResetRequest.create({
      data: {
        userId: targetUserId,
        resetType: 'admin_reset',
        resetBy: adminId,
        tempPassword: tempPassword, // Store for admin to communicate
      },
    });

    return { tempPassword };
  }
}


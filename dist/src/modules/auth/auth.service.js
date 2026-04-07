"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { phone, password } = loginDto;
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
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === 'locked') {
            if (user.lockedUntil && new Date() < user.lockedUntil) {
                throw new common_1.UnauthorizedException('Account is locked. Please try again later.');
            }
            await this.prisma.user.update({
                where: { id: user.id },
                data: { status: 'active', failedAttempts: 0, lockedUntil: null },
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            const newFailedAttempts = user.failedAttempts + 1;
            if (newFailedAttempts >= 5) {
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
                throw new common_1.UnauthorizedException('Account locked due to too many failed attempts');
            }
            await this.prisma.user.update({
                where: { id: user.id },
                data: { failedAttempts: newFailedAttempts },
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                failedAttempts: 0,
                lockedUntil: null,
                lastLogin: new Date(),
            },
        });
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
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
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
    async forgotPassword(phone) {
        const user = await this.prisma.user.findUnique({
            where: { phone },
        });
        if (!user || !user.email) {
            return { message: 'If the account exists with an email, an OTP will be sent' };
        }
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 15);
        await this.prisma.passwordResetRequest.create({
            data: {
                userId: user.id,
                resetType: 'email_otp',
                otpCode,
                otpExpiresAt,
            },
        });
        console.log(`OTP for ${phone}: ${otpCode}`);
        return { message: 'OTP sent to registered email' };
    }
    async verifyOtp(phone, otpCode) {
        const user = await this.prisma.user.findUnique({
            where: { phone },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid request');
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
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const resetToken = this.jwtService.sign({ sub: user.id, type: 'password_reset', requestId: resetRequest.id }, { expiresIn: '15m' });
        return { resetToken };
    }
    async resetPassword(resetToken, newPassword) {
        try {
            const payload = this.jwtService.verify(resetToken);
            if (payload.type !== 'password_reset') {
                throw new common_1.BadRequestException('Invalid reset token');
            }
            await this.prisma.passwordResetRequest.update({
                where: { id: payload.requestId },
                data: { isUsed: true },
            });
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
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
    }
    async adminResetPassword(adminId, targetUserId) {
        const tempPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(tempPassword, 10);
        await this.prisma.user.update({
            where: { id: targetUserId },
            data: {
                passwordHash,
                mustChangePassword: true,
            },
        });
        await this.prisma.passwordResetRequest.create({
            data: {
                userId: targetUserId,
                resetType: 'admin_reset',
                resetBy: adminId,
                tempPassword: tempPassword,
            },
        });
        return { tempPassword };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
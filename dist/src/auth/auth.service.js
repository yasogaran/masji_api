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
const tenant_service_1 = require("../database/tenant.service");
let AuthService = class AuthService {
    constructor(jwtService, tenantService) {
        this.jwtService = jwtService;
        this.tenantService = tenantService;
        this.MAX_FAILED_ATTEMPTS = 5;
        this.LOCK_DURATION_MINUTES = 30;
    }
    async login(loginDto, subdomain) {
        const tenant = await this.tenantService.findBySubdomain(subdomain);
        if (!tenant) {
            throw new common_1.UnauthorizedException('Invalid tenant');
        }
        const prisma = await this.tenantService.getClientForTenant(tenant);
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
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
            throw new common_1.UnauthorizedException(`Account locked. Try again in ${minutesLeft} minutes.`);
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            const failedAttempts = user.failedAttempts + 1;
            const updateData = { failedAttempts };
            if (failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
                const lockedUntil = new Date();
                lockedUntil.setMinutes(lockedUntil.getMinutes() + this.LOCK_DURATION_MINUTES);
                updateData.lockedUntil = lockedUntil;
            }
            await prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedAttempts: 0,
                lockedUntil: null,
                lastLogin: new Date(),
            },
        });
        const permissions = user.permissions.map((up) => up.permission.code);
        const payload = {
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
    async changePassword(userId, dbName, dto) {
        const tenant = await this.tenantService.findByDbName(dbName);
        if (!tenant) {
            throw new common_1.UnauthorizedException('Invalid tenant');
        }
        const prisma = await this.tenantService.getClientForTenant(tenant);
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isCurrentValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isCurrentValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
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
    async forgotPassword(dto, subdomain) {
        const tenant = await this.tenantService.findBySubdomain(subdomain);
        if (!tenant) {
            throw new common_1.BadRequestException('Invalid tenant');
        }
        const prisma = await this.tenantService.getClientForTenant(tenant);
        const user = await prisma.user.findUnique({
            where: { phone: dto.phone },
        });
        if (!user || !user.email) {
            return { message: 'If the account exists, an OTP will be sent to the registered email' };
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        await prisma.passwordResetRequest.create({
            data: {
                userId: user.id,
                resetType: 'email_otp',
                otpCode: otp,
                otpExpiresAt: otpExpiry,
            },
        });
        console.log(`OTP for ${user.email}: ${otp}`);
        return { message: 'If the account exists, an OTP will be sent to the registered email' };
    }
    async verifyOtpAndResetPassword(dto, subdomain) {
        const tenant = await this.tenantService.findBySubdomain(subdomain);
        if (!tenant) {
            throw new common_1.BadRequestException('Invalid tenant');
        }
        const prisma = await this.tenantService.getClientForTenant(tenant);
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
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
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
    async adminResetPassword(adminId, targetUserId, dbName) {
        const tenant = await this.tenantService.findByDbName(dbName);
        if (!tenant) {
            throw new common_1.UnauthorizedException('Invalid tenant');
        }
        const prisma = await this.tenantService.getClientForTenant(tenant);
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
                    tempPassword: tempPassword,
                },
            }),
        ]);
        return {
            message: 'Password reset successfully',
            tempPassword,
        };
    }
    generateTempPassword() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    async validateJwtPayload(payload) {
        const tenant = await this.tenantService.findByDbName(payload.dbName);
        if (!tenant) {
            throw new common_1.UnauthorizedException('Invalid tenant');
        }
        const prisma = await this.tenantService.getClientForTenant(tenant);
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
            include: { person: true },
        });
        if (!user || user.status !== 'active') {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return {
            ...user,
            tenant,
            prisma,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        tenant_service_1.TenantService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
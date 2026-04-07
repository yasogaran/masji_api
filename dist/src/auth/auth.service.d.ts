import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../database/tenant.service';
import { LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
export interface JwtPayload {
    sub: string;
    phone: string;
    dbName: string;
    permissions: string[];
}
export declare class AuthService {
    private jwtService;
    private tenantService;
    private readonly MAX_FAILED_ATTEMPTS;
    private readonly LOCK_DURATION_MINUTES;
    constructor(jwtService: JwtService, tenantService: TenantService);
    login(loginDto: LoginDto, subdomain: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            phone: string;
            email: string;
            fullName: string;
            mustChangePassword: boolean;
            permissions: string[];
        };
    }>;
    changePassword(userId: string, dbName: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto, subdomain: string): Promise<{
        message: string;
    }>;
    verifyOtpAndResetPassword(dto: ResetPasswordDto, subdomain: string): Promise<{
        message: string;
    }>;
    adminResetPassword(adminId: string, targetUserId: string, dbName: string): Promise<{
        message: string;
        tempPassword: string;
    }>;
    private generateTempPassword;
    validateJwtPayload(payload: JwtPayload): Promise<{
        tenant: import("../database/tenant.service").TenantInfo;
        prisma: import(".prisma/client").PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
        person: {
            id: string;
            fullName: string;
            nic: string | null;
            dob: Date | null;
            gender: string | null;
            phone: string | null;
            email: string | null;
            houseId: string;
            familyHeadId: string | null;
            relationshipTypeId: number | null;
            memberStatusId: number | null;
            civilStatusId: number | null;
            dateOfDeath: Date | null;
            educationLevelId: number | null;
            occupationId: number | null;
            bloodGroup: string | null;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isFamilyHead: boolean;
            familyName: string | null;
            isSandaaEligible: boolean;
            sandaaExemptReason: string | null;
        };
        id: string;
        phone: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        personId: string;
        passwordHash: string;
        mustChangePassword: boolean;
        passwordChangedAt: Date | null;
        failedAttempts: number;
        lockedUntil: Date | null;
        lastLogin: Date | null;
    }>;
}

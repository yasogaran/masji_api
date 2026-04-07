import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, JwtPayload } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: JwtPayload): Promise<{
        user: {
            tenant: import("../../database/tenant.service").TenantInfo;
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
        };
        sub: string;
        phone: string;
        dbName: string;
        permissions: string[];
    }>;
}
export {};

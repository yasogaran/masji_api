import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number): Promise<{
        data: {
            passwordHash: any;
            person: {
                id: string;
                fullName: string;
                phone: string;
            };
            id: string;
            phone: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            personId: string;
            mustChangePassword: boolean;
            passwordChangedAt: Date | null;
            failedAttempts: number;
            lockedUntil: Date | null;
            lastLogin: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
        passwordHash: any;
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
        permissions: ({
            permission: {
                id: number;
                description: string | null;
                code: string;
                module: string;
                action: string;
            };
        } & {
            id: string;
            mahallaId: string | null;
            grantedAt: Date;
            grantedBy: string | null;
            userId: string;
            permissionId: number;
        })[];
        id: string;
        phone: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        personId: string;
        mustChangePassword: boolean;
        passwordChangedAt: Date | null;
        failedAttempts: number;
        lockedUntil: Date | null;
        lastLogin: Date | null;
    }>;
    create(createUserDto: CreateUserDto): Promise<{
        passwordHash: any;
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
        mustChangePassword: boolean;
        passwordChangedAt: Date | null;
        failedAttempts: number;
        lockedUntil: Date | null;
        lastLogin: Date | null;
    }>;
    updateStatus(id: string, status: 'active' | 'inactive'): Promise<{
        passwordHash: any;
        id: string;
        phone: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        personId: string;
        mustChangePassword: boolean;
        passwordChangedAt: Date | null;
        failedAttempts: number;
        lockedUntil: Date | null;
        lastLogin: Date | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}

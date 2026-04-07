import { PrismaService } from '../../prisma/prisma.service';
import { UpdateFamilyDto, QueryFamiliesDto } from './dto/families.dto';
export declare class FamiliesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryFamiliesDto): Promise<{
        data: ({
            house: {
                mahalla: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    createdBy: string | null;
                    title: string;
                    description: string | null;
                    isActive: boolean;
                    isOutJamath: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                isActive: boolean;
                mahallaId: string;
                houseNumber: number;
                addressLine1: string | null;
                addressLine2: string | null;
                addressLine3: string | null;
                city: string | null;
                postalCode: string | null;
            };
            familyMembers: {
                id: string;
                fullName: string;
                gender: string;
                phone: string;
                relationshipType: {
                    id: number;
                    title: string;
                    sortOrder: number;
                };
                memberStatus: {
                    id: number;
                    title: string;
                };
            }[];
            relationshipType: {
                id: number;
                title: string;
                sortOrder: number;
            };
        } & {
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        sandaaHistory: any[];
        house: {
            mahalla: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                title: string;
                description: string | null;
                isActive: boolean;
                isOutJamath: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isActive: boolean;
            mahallaId: string;
            houseNumber: number;
            addressLine1: string | null;
            addressLine2: string | null;
            addressLine3: string | null;
            city: string | null;
            postalCode: string | null;
        };
        familyMembers: ({
            relationshipType: {
                id: number;
                title: string;
                sortOrder: number;
            };
            memberStatus: {
                id: number;
                title: string;
            };
            civilStatus: {
                id: number;
                title: string;
            };
        } & {
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
        })[];
        relationshipType: {
            id: number;
            title: string;
            sortOrder: number;
        };
        memberStatus: {
            id: number;
            title: string;
        };
        civilStatus: {
            id: number;
            title: string;
        };
        educationLevel: {
            id: number;
            title: string;
            sortOrder: number;
        };
        occupation: {
            id: number;
            title: string;
        };
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
    }>;
    getSummary(mahallaId?: string): Promise<{
        totalFamilies: number;
        eligibleFamilies: number;
        nonEligibleFamilies: number;
        byMahalla: {
            mahallaId: string;
            mahallaTitle: string;
            totalFamilies: number;
            eligibleFamilies: number;
            nonEligibleFamilies: number;
        }[];
    }>;
    update(id: string, dto: UpdateFamilyDto): Promise<{
        house: {
            mahalla: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                title: string;
                description: string | null;
                isActive: boolean;
                isOutJamath: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isActive: boolean;
            mahallaId: string;
            houseNumber: number;
            addressLine1: string | null;
            addressLine2: string | null;
            addressLine3: string | null;
            city: string | null;
            postalCode: string | null;
        };
        familyMembers: {
            id: string;
            fullName: string;
        }[];
    } & {
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
    }>;
    updateEligibility(id: string, isSandaaEligible: boolean, sandaaExemptReason?: string): Promise<{
        house: {
            mahalla: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                createdBy: string | null;
                title: string;
                description: string | null;
                isActive: boolean;
                isOutJamath: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string | null;
            isActive: boolean;
            mahallaId: string;
            houseNumber: number;
            addressLine1: string | null;
            addressLine2: string | null;
            addressLine3: string | null;
            city: string | null;
            postalCode: string | null;
        };
        familyMembers: {
            id: string;
            fullName: string;
        }[];
    } & {
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
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}

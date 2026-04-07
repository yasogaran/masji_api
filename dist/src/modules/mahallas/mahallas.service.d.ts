import { PrismaService } from '../../prisma/prisma.service';
import { CreateMahallaDto } from './dto/create-mahalla.dto';
import { UpdateMahallaDto } from './dto/update-mahalla.dto';
export declare class MahallasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        _count: {
            families: number;
            people: number;
            houses: number;
            mosques: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        title: string;
        description: string | null;
        isActive: boolean;
        isOutJamath: boolean;
    }[]>;
    findById(id: string): Promise<{
        _count: {
            houses: number;
            mosques: number;
        };
        houses: {
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
        }[];
        mosques: {
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            isActive: boolean;
            mahallaId: string;
            addressLine1: string | null;
            addressLine2: string | null;
            city: string | null;
            mosqueType: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        title: string;
        description: string | null;
        isActive: boolean;
        isOutJamath: boolean;
    }>;
    create(createMahallaDto: CreateMahallaDto, createdBy?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        title: string;
        description: string | null;
        isActive: boolean;
        isOutJamath: boolean;
    }>;
    update(id: string, updateMahallaDto: UpdateMahallaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: string | null;
        title: string;
        description: string | null;
        isActive: boolean;
        isOutJamath: boolean;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getStats(id: string): Promise<{
        totalHouses: number;
        totalPeople: number;
        activeMembers: number;
        totalMosques: number;
        maleCount: number;
        femaleCount: number;
        totalFamilies: number;
    }>;
    getFamilies(id: string): Promise<{
        id: string;
        name: string;
        familyHead: {
            id: string;
            fullName: string;
            phone: string;
            nic: string;
            gender: string;
            memberStatus: {
                id: number;
                title: string;
            };
        };
        house: {
            id: string;
            houseNumber: number;
        };
        members: {
            id: string;
            fullName: string;
            gender: string;
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
        _count: {
            members: number;
        };
        isSandaaEligible: boolean;
        sandaaExemptReason: string;
    }[]>;
}

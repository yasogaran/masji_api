import { HousesService } from './houses.service';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
export declare class HousesController {
    private housesService;
    constructor(housesService: HousesService);
    findAll(page?: number, limit?: number, mahallaId?: string, search?: string): Promise<{
        data: {
            _count: {
                families: number;
                people: number;
            };
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
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<{
        familyHeads: ({
            familyHead: {
                id: string;
                fullName: string;
            };
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
        people: ({
            familyHead: {
                id: string;
                fullName: string;
            };
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
    }>;
    getHouseMembers(id: string): Promise<{
        families: {
            id: string;
            name: any;
            familyHead: {
                familyHead: {
                    id: string;
                    fullName: string;
                };
                relationshipType: {
                    id: number;
                    title: string;
                    sortOrder: number;
                };
                memberStatus: {
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
            };
            members: ({
                familyHead: {
                    id: string;
                    fullName: string;
                };
                relationshipType: {
                    id: number;
                    title: string;
                    sortOrder: number;
                };
                memberStatus: {
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
            memberCount: number;
            isSandaaEligible: any;
            sandaaExemptReason: any;
        }[];
        allMembers: ({
            familyHead: {
                id: string;
                fullName: string;
            };
            relationshipType: {
                id: number;
                title: string;
                sortOrder: number;
            };
            memberStatus: {
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
        totalMembers: number;
        totalFamilies: number;
    }>;
    create(createHouseDto: CreateHouseDto, userId: string): Promise<{
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
    }>;
    update(id: string, updateHouseDto: UpdateHouseDto): Promise<{
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
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}

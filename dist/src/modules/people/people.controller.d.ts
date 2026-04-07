import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
export declare class PeopleController {
    private peopleService;
    constructor(peopleService: PeopleService);
    findAll(page?: number, limit?: number, search?: string, mahallaId?: string, houseId?: string, status?: number): Promise<{
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
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getLookups(): Promise<{
        memberStatuses: {
            id: number;
            title: string;
        }[];
        civilStatuses: {
            id: number;
            title: string;
        }[];
        educationLevels: {
            id: number;
            title: string;
            sortOrder: number;
        }[];
        occupations: {
            id: number;
            title: string;
        }[];
        relationshipTypes: {
            id: number;
            title: string;
            sortOrder: number;
        }[];
    }>;
    getFamilyHeads(mahallaId?: string): Promise<({
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
    })[]>;
    findByNic(nic: string): Promise<{
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
    findById(id: string): Promise<{
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
        familyHead: {
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
        familyMembers: {
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
        }[];
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
    create(createPersonDto: CreatePersonDto, userId: string): Promise<{
        house: {
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
    }>;
    update(id: string, updatePersonDto: UpdatePersonDto): Promise<{
        house: {
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
        familyHead: {
            id: string;
            fullName: string;
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
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}

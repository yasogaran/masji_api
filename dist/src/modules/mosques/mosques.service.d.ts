import { PrismaService } from '../../prisma/prisma.service';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto';
export declare class MosquesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        _count: {
            roleAssignments: number;
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
    } & {
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
    })[]>;
    findById(id: string): Promise<{
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
        roleAssignments: ({
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
            mosqueRole: {
                id: string;
                description: string | null;
                roleName: string;
                isActive: boolean;
            };
        } & {
            id: string;
            notes: string | null;
            createdAt: Date;
            personId: string;
            startDate: Date;
            endDate: Date | null;
            mosqueId: string;
            mosqueRoleId: string;
            assignedBy: string | null;
        })[];
    } & {
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
    }>;
    getParentMosque(): Promise<{
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
    }>;
    create(createMosqueDto: CreateMosqueDto, createdBy?: string): Promise<{
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
    }>;
    update(id: string, updateMosqueDto: UpdateMosqueDto): Promise<{
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
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    getRoles(): Promise<{
        id: string;
        description: string | null;
        roleName: string;
        isActive: boolean;
    }[]>;
    createRole(data: {
        roleName: string;
        description?: string;
    }): Promise<{
        id: string;
        description: string | null;
        roleName: string;
        isActive: boolean;
    }>;
    updateRole(id: string, data: {
        roleName?: string;
        description?: string;
        isActive?: boolean;
    }): Promise<{
        id: string;
        description: string | null;
        roleName: string;
        isActive: boolean;
    }>;
    deleteRole(id: string): Promise<{
        id: string;
        description: string | null;
        roleName: string;
        isActive: boolean;
    }>;
    getRoleAssignments(mosqueId: string): Promise<({
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
        mosqueRole: {
            id: string;
            description: string | null;
            roleName: string;
            isActive: boolean;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        personId: string;
        startDate: Date;
        endDate: Date | null;
        mosqueId: string;
        mosqueRoleId: string;
        assignedBy: string | null;
    })[]>;
    addRoleAssignment(data: {
        mosqueId: string;
        personId: string;
        mosqueRoleId: string;
        startDate: string;
        endDate?: string;
    }): Promise<{
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
        mosqueRole: {
            id: string;
            description: string | null;
            roleName: string;
            isActive: boolean;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        personId: string;
        startDate: Date;
        endDate: Date | null;
        mosqueId: string;
        mosqueRoleId: string;
        assignedBy: string | null;
    }>;
    updateRoleAssignment(id: string, data: {
        endDate?: string;
    }): Promise<{
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
        mosqueRole: {
            id: string;
            description: string | null;
            roleName: string;
            isActive: boolean;
        };
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        personId: string;
        startDate: Date;
        endDate: Date | null;
        mosqueId: string;
        mosqueRoleId: string;
        assignedBy: string | null;
    }>;
    removeRoleAssignment(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        personId: string;
        startDate: Date;
        endDate: Date | null;
        mosqueId: string;
        mosqueRoleId: string;
        assignedBy: string | null;
    }>;
}

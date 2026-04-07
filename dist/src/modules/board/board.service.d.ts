import { PrismaService } from '../../prisma/prisma.service';
export declare class BoardService {
    private prisma;
    constructor(prisma: PrismaService);
    getRoles(): Promise<{
        id: string;
        sortOrder: number;
        roleName: string;
        isMahallaSpecific: boolean;
        isActive: boolean;
    }[]>;
    createRole(data: {
        roleName: string;
        isMahallaSpecific?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: string;
        sortOrder: number;
        roleName: string;
        isMahallaSpecific: boolean;
        isActive: boolean;
    }>;
    updateRole(id: string, data: {
        roleName?: string;
        isMahallaSpecific?: boolean;
        sortOrder?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        sortOrder: number;
        roleName: string;
        isMahallaSpecific: boolean;
        isActive: boolean;
    }>;
    deleteRole(id: string): Promise<{
        id: string;
        sortOrder: number;
        roleName: string;
        isMahallaSpecific: boolean;
        isActive: boolean;
    }>;
    getTerms(): Promise<({
        _count: {
            members: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        startDate: Date;
        endDate: Date | null;
        termYears: number;
        isCurrent: boolean;
    })[]>;
    getTermById(id: string): Promise<{
        members: ({
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
            boardRole: {
                id: string;
                sortOrder: number;
                roleName: string;
                isMahallaSpecific: boolean;
                isActive: boolean;
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
            notes: string | null;
            createdAt: Date;
            mahallaId: string | null;
            personId: string;
            startDate: Date;
            endDate: Date | null;
            boardTermId: string;
            boardRoleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        startDate: Date;
        endDate: Date | null;
        termYears: number;
        isCurrent: boolean;
    }>;
    getCurrentTerm(): Promise<{
        members: ({
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
            boardRole: {
                id: string;
                sortOrder: number;
                roleName: string;
                isMahallaSpecific: boolean;
                isActive: boolean;
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
            notes: string | null;
            createdAt: Date;
            mahallaId: string | null;
            personId: string;
            startDate: Date;
            endDate: Date | null;
            boardTermId: string;
            boardRoleId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        startDate: Date;
        endDate: Date | null;
        termYears: number;
        isCurrent: boolean;
    }>;
    createTerm(data: {
        name: string;
        startDate: string;
        endDate?: string;
        isCurrent?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        startDate: Date;
        endDate: Date | null;
        termYears: number;
        isCurrent: boolean;
    }>;
    updateTerm(id: string, data: {
        name?: string;
        startDate?: string;
        endDate?: string;
        isCurrent?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        startDate: Date;
        endDate: Date | null;
        termYears: number;
        isCurrent: boolean;
    }>;
    deleteTerm(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        startDate: Date;
        endDate: Date | null;
        termYears: number;
        isCurrent: boolean;
    }>;
    getMembers(termId: string): Promise<({
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
        boardRole: {
            id: string;
            sortOrder: number;
            roleName: string;
            isMahallaSpecific: boolean;
            isActive: boolean;
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
        notes: string | null;
        createdAt: Date;
        mahallaId: string | null;
        personId: string;
        startDate: Date;
        endDate: Date | null;
        boardTermId: string;
        boardRoleId: string;
    })[]>;
    addMember(data: {
        boardTermId: string;
        personId: string;
        boardRoleId: string;
        mahallaId?: string;
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
        boardRole: {
            id: string;
            sortOrder: number;
            roleName: string;
            isMahallaSpecific: boolean;
            isActive: boolean;
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
        notes: string | null;
        createdAt: Date;
        mahallaId: string | null;
        personId: string;
        startDate: Date;
        endDate: Date | null;
        boardTermId: string;
        boardRoleId: string;
    }>;
    updateMember(id: string, data: {
        boardRoleId?: string;
        mahallaId?: string;
        startDate?: string;
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
        boardRole: {
            id: string;
            sortOrder: number;
            roleName: string;
            isMahallaSpecific: boolean;
            isActive: boolean;
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
        notes: string | null;
        createdAt: Date;
        mahallaId: string | null;
        personId: string;
        startDate: Date;
        endDate: Date | null;
        boardTermId: string;
        boardRoleId: string;
    }>;
    removeMember(id: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        mahallaId: string | null;
        personId: string;
        startDate: Date;
        endDate: Date | null;
        boardTermId: string;
        boardRoleId: string;
    }>;
}

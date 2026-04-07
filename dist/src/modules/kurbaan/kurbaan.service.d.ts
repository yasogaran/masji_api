import { PrismaService } from '../../prisma/prisma.service';
import { CreateKurbaanPeriodDto, UpdateKurbaanPeriodDto, CreateKurbaanParticipantDto, BulkCreateParticipantsDto, RegisterAllFamiliesDto, MarkDistributedDto, KurbaanParticipantQueryDto } from './dto/kurbaan.dto';
export declare class KurbaanService {
    private prisma;
    constructor(prisma: PrismaService);
    getPeriods(query?: {
        isActive?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            stats: {
                totalParticipants: number;
                distributed: number;
                pending: number;
            };
            _count: {
                participants: number;
            };
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            isActive: boolean;
            hijriYear: number;
            gregorianDate: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getActivePeriod(): Promise<{
        _count: {
            participants: number;
        };
    } & {
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        isActive: boolean;
        hijriYear: number;
        gregorianDate: Date | null;
    }>;
    getPeriodById(id: string): Promise<{
        stats: {
            totalParticipants: number;
            distributed: number;
            pending: number;
        };
        _count: {
            participants: number;
        };
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        isActive: boolean;
        hijriYear: number;
        gregorianDate: Date | null;
    }>;
    createPeriod(dto: CreateKurbaanPeriodDto, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        isActive: boolean;
        hijriYear: number;
        gregorianDate: Date | null;
    }>;
    updatePeriod(id: string, dto: UpdateKurbaanPeriodDto): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        isActive: boolean;
        hijriYear: number;
        gregorianDate: Date | null;
    }>;
    completePeriod(id: string): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        isActive: boolean;
        hijriYear: number;
        gregorianDate: Date | null;
    }>;
    deletePeriod(id: string): Promise<{
        id: string;
        createdAt: Date;
        createdBy: string | null;
        name: string;
        isActive: boolean;
        hijriYear: number;
        gregorianDate: Date | null;
    }>;
    private generateQRCode;
    getParticipants(query: KurbaanParticipantQueryDto): Promise<{
        data: {
            familyCount: number;
            memberCount: number;
            familyHead: {
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
            };
            distributedByUser: {
                id: string;
                fullName: string;
            };
            kurbaanPeriod: {
                id: string;
                createdAt: Date;
                createdBy: string | null;
                name: string;
                isActive: boolean;
                hijriYear: number;
                gregorianDate: Date | null;
            };
            id: string;
            familyHeadId: string | null;
            createdAt: Date;
            isExternal: boolean;
            externalName: string | null;
            externalPhone: string | null;
            externalAddress: string | null;
            distributedAt: Date | null;
            distributedBy: string | null;
            kurbaanPeriodId: string;
            qrCode: string;
            isDistributed: boolean;
            externalPeopleCount: number | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getParticipantById(id: string): Promise<{
        familyHead: {
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
        };
        distributedByUser: {
            id: string;
            fullName: string;
        };
        kurbaanPeriod: {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            isActive: boolean;
            hijriYear: number;
            gregorianDate: Date | null;
        };
    } & {
        id: string;
        familyHeadId: string | null;
        createdAt: Date;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalAddress: string | null;
        distributedAt: Date | null;
        distributedBy: string | null;
        kurbaanPeriodId: string;
        qrCode: string;
        isDistributed: boolean;
        externalPeopleCount: number | null;
    }>;
    createParticipant(dto: CreateKurbaanParticipantDto, userId?: string): Promise<{
        kurbaanPeriod: {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            isActive: boolean;
            hijriYear: number;
            gregorianDate: Date | null;
        };
    } & {
        id: string;
        familyHeadId: string | null;
        createdAt: Date;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalAddress: string | null;
        distributedAt: Date | null;
        distributedBy: string | null;
        kurbaanPeriodId: string;
        qrCode: string;
        isDistributed: boolean;
        externalPeopleCount: number | null;
    }>;
    bulkCreateParticipants(dto: BulkCreateParticipantsDto, userId?: string): Promise<{
        created: number;
        skipped: number;
        errors: string[];
    }>;
    registerAllFamilies(dto: RegisterAllFamiliesDto, userId?: string): Promise<{
        created: number;
        skipped: number;
        errors: string[];
    }>;
    markDistributed(id: string, dto: MarkDistributedDto, userId?: string): Promise<{
        familyHead: {
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
        };
        kurbaanPeriod: {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            isActive: boolean;
            hijriYear: number;
            gregorianDate: Date | null;
        };
    } & {
        id: string;
        familyHeadId: string | null;
        createdAt: Date;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalAddress: string | null;
        distributedAt: Date | null;
        distributedBy: string | null;
        kurbaanPeriodId: string;
        qrCode: string;
        isDistributed: boolean;
        externalPeopleCount: number | null;
    }>;
    markDistributedByQR(qrCode: string, userId?: string): Promise<{
        familyHead: {
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
        };
        kurbaanPeriod: {
            id: string;
            createdAt: Date;
            createdBy: string | null;
            name: string;
            isActive: boolean;
            hijriYear: number;
            gregorianDate: Date | null;
        };
    } & {
        id: string;
        familyHeadId: string | null;
        createdAt: Date;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalAddress: string | null;
        distributedAt: Date | null;
        distributedBy: string | null;
        kurbaanPeriodId: string;
        qrCode: string;
        isDistributed: boolean;
        externalPeopleCount: number | null;
    }>;
    deleteParticipant(id: string): Promise<{
        id: string;
        familyHeadId: string | null;
        createdAt: Date;
        isExternal: boolean;
        externalName: string | null;
        externalPhone: string | null;
        externalAddress: string | null;
        distributedAt: Date | null;
        distributedBy: string | null;
        kurbaanPeriodId: string;
        qrCode: string;
        isDistributed: boolean;
        externalPeopleCount: number | null;
    }>;
    getPeriodReport(periodId: string): Promise<{
        period: {
            id: string;
            name: string;
            hijriYear: number;
            gregorianDate: Date;
            isActive: boolean;
        };
        summary: {
            totalParticipants: number;
            distributed: number;
            pending: number;
            distributionPercentage: number;
        };
        registered: {
            total: number;
            distributed: number;
            pending: number;
        };
        external: {
            total: number;
            distributed: number;
            pending: number;
            totalPeople: number;
        };
        byMahalla: {
            mahallaId: string;
            mahallaName: string;
            total: number;
            distributed: number;
            pending: number;
        }[];
    }>;
    getParticipantsForCards(periodId: string, mahallaId?: string, filterType?: string, page?: number, limit?: number): Promise<({
        id: any;
        qrCode: any;
        isDistributed: any;
        isExternal: boolean;
        familyHead: {
            id: any;
            name: any;
            phone: any;
        };
        house: {
            number: any;
            mahalla: string;
            address: any;
        };
        memberCount: any;
    } | {
        id: any;
        qrCode: any;
        isDistributed: any;
        isExternal: boolean;
        familyHead: {
            id: any;
            name: any;
            phone: any;
        };
        house: {
            number: any;
            mahalla: any;
            address: string;
        };
        memberCount: number;
    })[] | {
        data: ({
            id: any;
            qrCode: any;
            isDistributed: any;
            isExternal: boolean;
            familyHead: {
                id: any;
                name: any;
                phone: any;
            };
            house: {
                number: any;
                mahalla: string;
                address: any;
            };
            memberCount: any;
        } | {
            id: any;
            qrCode: any;
            isDistributed: any;
            isExternal: boolean;
            familyHead: {
                id: any;
                name: any;
                phone: any;
            };
            house: {
                number: any;
                mahalla: any;
                address: string;
            };
            memberCount: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}

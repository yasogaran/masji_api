export declare class CreateKurbaanPeriodDto {
    name: string;
    hijriYear: number;
    gregorianDate?: string;
}
export declare class UpdateKurbaanPeriodDto {
    name?: string;
    hijriYear?: number;
    gregorianDate?: string;
    isActive?: boolean;
}
export declare class KurbaanPeriodQueryDto {
    isActive?: boolean;
    page?: number;
    limit?: number;
}
export declare class CreateKurbaanParticipantDto {
    kurbaanPeriodId: string;
    familyHeadId?: string;
    isExternal?: boolean;
    externalName?: string;
    externalPhone?: string;
    externalAddress?: string;
    externalPeopleCount?: number;
}
export declare class BulkCreateParticipantsDto {
    kurbaanPeriodId: string;
    familyHeadIds: string[];
}
export declare class RegisterAllFamiliesDto {
    kurbaanPeriodId: string;
    mahallaId?: string;
}
export declare class MarkDistributedDto {
    notes?: string;
}
export declare class KurbaanParticipantQueryDto {
    kurbaanPeriodId?: string;
    mahallaId?: string;
    isDistributed?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class KurbaanReportDto {
    period: {
        id: string;
        name: string;
        hijriYear: number;
        gregorianDate: Date | null;
        isActive: boolean;
    };
    summary: {
        totalParticipants: number;
        distributed: number;
        pending: number;
        distributionPercentage: number;
    };
    byMahalla: {
        mahallaId: string;
        mahallaName: string;
        total: number;
        distributed: number;
        pending: number;
    }[];
}

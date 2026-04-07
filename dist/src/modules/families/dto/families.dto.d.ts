export declare class UpdateFamilyDto {
    familyName?: string;
    isSandaaEligible?: boolean;
    sandaaExemptReason?: string;
}
export declare class QueryFamiliesDto {
    page?: number;
    limit?: number;
    search?: string;
    mahallaId?: string;
    isSandaaEligible?: boolean;
}

export declare class CreateSandaaConfigDto {
    mahallaId?: string;
    amount: number;
    frequency?: string;
    whoPays?: string;
    effectiveFrom: string;
    effectiveTo?: string;
}
export declare class UpdateSandaaConfigDto {
    amount?: number;
    frequency?: string;
    effectiveTo?: string;
}
export declare class RecordPaymentDto {
    paymentId: string;
    paidAmount?: number;
    notes?: string;
}
export declare class BulkRecordPaymentsDto {
    payments: {
        paymentId: string;
        paidAmount?: number;
        notes?: string;
    }[];
}
export declare class GeneratePaymentsDto {
    month: number;
    year: number;
    mahallaId?: string;
}
export declare class SandaaPaymentQueryDto {
    mahallaId?: string;
    familyId?: string;
    status?: string;
    month?: number;
    year?: number;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class UpdateFamilyEligibilityDto {
    familyId: string;
    isSandaaEligible: boolean;
    sandaaExemptReason?: string;
}

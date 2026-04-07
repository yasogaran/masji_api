export declare class CreatePaymentTypeDto {
    name: string;
    amount?: number;
    description?: string;
    type?: string;
    isActive?: boolean;
}
export declare class UpdatePaymentTypeDto {
    name?: string;
    amount?: number;
    description?: string;
    type?: string;
    isActive?: boolean;
}
export declare class CreateOtherPaymentDto {
    personId: string;
    paymentTypeId: string;
    amount?: number;
    reason?: string;
    status?: string;
}
export declare class RecordOtherPaymentDto {
    paymentId: string;
    notes?: string;
}
export declare class UpdateOtherPaymentDto {
    personId?: string;
    paymentTypeId?: string;
    amount?: number;
    reason?: string;
    status?: string;
}
export declare class OtherPaymentQueryDto {
    paymentTypeId?: string;
    personId?: string;
    status?: string;
    search?: string;
    year?: number;
    month?: number;
    page?: number;
    limit?: number;
}

export declare enum ZakathPeriodStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum ZakathRequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    DISTRIBUTED = "distributed",
    PARTIAL = "partial"
}
export declare class CreateZakathCategoryDto {
    name: string;
    nameArabic?: string;
    description?: string;
    sortOrder?: number;
}
export declare class UpdateZakathCategoryDto {
    name?: string;
    nameArabic?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class CreateZakathPeriodDto {
    name: string;
    hijriMonth?: number;
    hijriYear: number;
    gregorianStart?: string;
    gregorianEnd?: string;
}
export declare class UpdateZakathPeriodDto {
    name?: string;
    hijriMonth?: number;
    hijriYear?: number;
    gregorianStart?: string;
    gregorianEnd?: string;
    isActive?: boolean;
}
export declare class CompleteCycleDto {
    notes?: string;
}
export declare class CreateZakathCollectionDto {
    zakathPeriodId: string;
    donorId?: string;
    donorName?: string;
    donorPhone?: string;
    amount: number;
    collectionDate: string;
    paymentMethod?: string;
    referenceNo?: string;
    notes?: string;
}
export declare class UpdateZakathCollectionDto {
    donorId?: string;
    donorName?: string;
    donorPhone?: string;
    amount?: number;
    collectionDate?: string;
    paymentMethod?: string;
    referenceNo?: string;
    notes?: string;
}
export declare class CreateZakathRequestDto {
    zakathPeriodId: string;
    requesterId?: string;
    categoryId: string;
    amountRequested: number;
    reason: string;
    notes?: string;
    supportingDocs?: string;
    isExternal?: boolean;
    externalName?: string;
    externalPhone?: string;
    externalNic?: string;
    externalAddress?: string;
}
export declare class UpdateZakathRequestDto {
    categoryId?: string;
    amountRequested?: number;
    reason?: string;
    notes?: string;
    supportingDocs?: string;
}
export declare class ApproveRequestDto {
    amountApproved: number;
    decisionNotes?: string;
}
export declare class RejectRequestDto {
    decisionNotes: string;
}
export declare class CreateZakathDistributionDto {
    zakathRequestId: string;
    amount: number;
    notes?: string;
}
export declare class ZakathPeriodQueryDto {
    status?: ZakathPeriodStatus;
    year?: number;
    page?: number;
    limit?: number;
}
export declare class ZakathCollectionQueryDto {
    zakathPeriodId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class ZakathRequestQueryDto {
    zakathPeriodId?: string;
    categoryId?: string;
    status?: ZakathRequestStatus;
    search?: string;
    page?: number;
    limit?: number;
}

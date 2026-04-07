export declare enum DonationType {
    MONEY = "money",
    GOODS = "goods"
}
export declare class CreateDonationCategoryDto {
    name: string;
    type: string;
    isActive?: boolean;
}
export declare class UpdateDonationCategoryDto {
    name?: string;
    type?: string;
    isActive?: boolean;
}
export declare class CreateDonationDto {
    donorId?: string;
    donorName?: string;
    donorPhone?: string;
    categoryId: string;
    donationType: DonationType;
    amount?: number;
    itemDescription?: string;
    quantity?: number;
    unit?: string;
    estimatedValue?: number;
    donationDate: string;
    notes?: string;
}
export declare class UpdateDonationDto {
    donorId?: string;
    donorName?: string;
    donorPhone?: string;
    categoryId?: string;
    donationType?: DonationType;
    amount?: number;
    itemDescription?: string;
    quantity?: number;
    unit?: string;
    estimatedValue?: number;
    donationDate?: string;
    notes?: string;
}
export declare class CreateDistributionDto {
    recipientId?: string;
    recipientName?: string;
    recipientPhone?: string;
    recipientAddress?: string;
    categoryId: string;
    distributionType: DonationType;
    amount?: number;
    itemDescription?: string;
    quantity?: number;
    unit?: string;
    reason?: string;
    distributionDate: string;
    notes?: string;
}
export declare class UpdateDistributionDto {
    recipientId?: string;
    recipientName?: string;
    recipientPhone?: string;
    recipientAddress?: string;
    categoryId?: string;
    distributionType?: DonationType;
    amount?: number;
    itemDescription?: string;
    quantity?: number;
    unit?: string;
    reason?: string;
    distributionDate?: string;
    notes?: string;
}
export declare class DonationQueryDto {
    year?: number;
    type?: string;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class DistributionQueryDto {
    year?: number;
    type?: string;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export declare class CreatePropertyDto {
    name: string;
    address?: string;
    description?: string;
    propertyType?: string;
    purchaseValue?: number;
    currentValue?: number;
}
export declare class UpdatePropertyDto {
    name?: string;
    address?: string;
    description?: string;
    propertyType?: string;
    purchaseValue?: number;
    currentValue?: number;
    isActive?: boolean;
}
export declare class CreatePropertyRentalDto {
    propertyId: string;
    tenantName: string;
    tenantContact?: string;
    tenantAddress?: string;
    monthlyRent: number;
    startDate: string;
    endDate?: string;
    notes?: string;
}
export declare class UpdatePropertyRentalDto {
    tenantName?: string;
    tenantContact?: string;
    tenantAddress?: string;
    monthlyRent?: number;
    endDate?: string;
    isActive?: boolean;
    notes?: string;
}
export declare class CreateRentPaymentDto {
    propertyRentalId: string;
    amount: number;
    periodMonth: number;
    periodYear: number;
    paidAt?: string;
    notes?: string;
}
export declare class PropertyQueryDto {
    search?: string;
    propertyType?: string;
    hasActiveRental?: boolean;
    includeInactive?: boolean;
}

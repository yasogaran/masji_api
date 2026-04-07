export declare class CreateInventoryItemDto {
    name: string;
    description?: string;
    quantity?: number;
    location?: string;
    isRentable?: boolean;
    rentalPrice?: number;
    category?: string;
}
export declare class UpdateInventoryItemDto {
    name?: string;
    description?: string;
    quantity?: number;
    location?: string;
    isRentable?: boolean;
    rentalPrice?: number;
    isActive?: boolean;
    category?: string;
}
export declare class CreateRentalDto {
    inventoryItemId: string;
    rentedTo?: string;
    rentedToName?: string;
    quantity?: number;
    rentalDate: string;
    expectedReturn?: string;
    rentalAmount?: number;
    notes?: string;
}
export declare class ReturnRentalDto {
    returnDate: string;
    paymentAmount?: number;
    paymentStatus?: string;
    paymentNotes?: string;
    notes?: string;
}
export declare class InventoryQueryDto {
    search?: string;
    category?: string;
    rentableOnly?: boolean;
    includeInactive?: boolean;
}
export declare class AdjustQuantityDto {
    type: 'increase' | 'decrease';
    quantity: number;
    reason: string;
    notes?: string;
}

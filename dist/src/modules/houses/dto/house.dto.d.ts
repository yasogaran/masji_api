export declare class CreateHouseDto {
    mahallaId: string;
    houseNumber?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    city?: string;
    postalCode?: string;
    isActive?: boolean;
}
export declare class UpdateHouseDto {
    houseNumber?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    city?: string;
    postalCode?: string;
    isActive?: boolean;
}
export declare class HouseQueryDto {
    mahallaId?: string;
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

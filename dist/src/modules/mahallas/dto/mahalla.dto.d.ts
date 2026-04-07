export declare class CreateMahallaDto {
    title: string;
    description?: string;
    isActive?: boolean;
    isOutJamath?: boolean;
}
export declare class UpdateMahallaDto {
    title?: string;
    description?: string;
    isActive?: boolean;
    isOutJamath?: boolean;
}
export declare class MahallaQueryDto {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

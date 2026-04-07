declare class PermissionDto {
    permissionId: number;
    mahallaId?: string;
}
export declare class CreateUserDto {
    personId: string;
    phone: string;
    email?: string;
    password: string;
    permissions?: PermissionDto[];
}
export {};

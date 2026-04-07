export declare class CreateUserDto {
    personId: string;
    phone: string;
    email?: string;
}
export declare class UpdateUserDto {
    phone?: string;
    email?: string;
    status?: string;
}
export declare class PermissionAssignmentDto {
    permissionId: number;
    mahallaId?: string;
}
export declare class UpdatePermissionsDto {
    permissions: PermissionAssignmentDto[];
}
export declare class UserQueryDto {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export declare class CreatePersonDto {
    fullName: string;
    nic?: string;
    dob?: string;
    gender?: string;
    phone?: string;
    email?: string;
    houseId: string;
    familyId?: string;
    familyHeadId?: string;
    relationshipTypeId?: number;
    memberStatusId?: number;
    civilStatusId?: number;
    educationLevelId?: number;
    occupationId?: number;
    bloodGroup?: string;
    notes?: string;
}
export declare class UpdatePersonDto {
    fullName?: string;
    nic?: string;
    dob?: string;
    gender?: string;
    phone?: string;
    email?: string;
    houseId?: string;
    familyId?: string | null;
    familyHeadId?: string | null;
    relationshipTypeId?: number;
    memberStatusId?: number;
    civilStatusId?: number;
    dateOfDeath?: string;
    educationLevelId?: number;
    occupationId?: number;
    bloodGroup?: string;
    notes?: string;
}
export declare class PersonQueryDto {
    mahallaId?: string;
    houseId?: string;
    search?: string;
    memberStatusId?: number;
    isFamilyHead?: boolean;
    page?: number;
    limit?: number;
}

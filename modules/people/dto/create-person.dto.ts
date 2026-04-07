import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  IsInt,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class CreatePersonDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  nic?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsIn(['male', 'female'])
  gender?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  houseId: string;

  // Removed familyId - families are now implicit based on family head
  
  @IsOptional()
  @IsString()
  familyHeadId?: string;

  @IsOptional()
  @IsInt()
  relationshipTypeId?: number;

  @IsOptional()
  @IsInt()
  memberStatusId?: number;

  @IsOptional()
  @IsInt()
  civilStatusId?: number;

  @IsOptional()
  @IsDateString()
  dateOfDeath?: string;

  @IsOptional()
  @IsInt()
  educationLevelId?: number;

  @IsOptional()
  @IsInt()
  occupationId?: number;

  @IsOptional()
  @IsString()
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  // Family-related fields (only relevant if this person is a family head)
  @IsOptional()
  @IsBoolean()
  isFamilyHead?: boolean;

  @IsOptional()
  @IsString()
  familyName?: string;

  @IsOptional()
  @IsBoolean()
  isSandaaEligible?: boolean;

  @IsOptional()
  @IsString()
  sandaaExemptReason?: string;
}

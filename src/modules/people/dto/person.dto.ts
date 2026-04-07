import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUUID,
  IsEmail,
  IsDateString,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreatePersonDto {
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  nic?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsUUID()
  houseId: string;

  @IsOptional()
  @IsUUID()
  familyId?: string;

  @IsOptional()
  @IsUUID()
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
  @IsInt()
  educationLevelId?: number;

  @IsOptional()
  @IsInt()
  occupationId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  nic?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsUUID()
  houseId?: string;

  @IsOptional()
  @IsUUID()
  familyId?: string | null;

  @IsOptional()
  @IsUUID()
  familyHeadId?: string | null;

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
  @MaxLength(5)
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PersonQueryDto {
  @IsOptional()
  @IsUUID()
  mahallaId?: string;

  @IsOptional()
  @IsUUID()
  houseId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  memberStatusId?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isFamilyHead?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}


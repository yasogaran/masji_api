import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateHouseDto {
  @IsUUID()
  mahallaId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  houseNumber?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateHouseDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  houseNumber?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine2?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine3?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class HouseQueryDto {
  @IsOptional()
  @IsUUID()
  mahallaId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

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


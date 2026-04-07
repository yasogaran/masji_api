import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateHouseDto {
  @IsNotEmpty()
  @IsString()
  mahallaId: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  addressLine3?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


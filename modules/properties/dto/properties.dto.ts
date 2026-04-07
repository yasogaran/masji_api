import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min } from 'class-validator';

// Property DTOs
export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  purchaseValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  purchaseValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentValue?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Property Rental DTOs
export class CreatePropertyRentalDto {
  @IsString()
  propertyId: string;

  @IsString()
  tenantName: string;

  @IsOptional()
  @IsString()
  tenantContact?: string;

  @IsOptional()
  @IsString()
  tenantAddress?: string;

  @IsNumber()
  @Min(0)
  monthlyRent: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePropertyRentalDto {
  @IsOptional()
  @IsString()
  tenantName?: string;

  @IsOptional()
  @IsString()
  tenantContact?: string;

  @IsOptional()
  @IsString()
  tenantAddress?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyRent?: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

// Rent Payment DTOs
export class CreateRentPaymentDto {
  @IsString()
  propertyRentalId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(1)
  periodMonth: number;

  @IsNumber()
  periodYear: number;

  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PropertyQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsBoolean()
  hasActiveRental?: boolean;

  @IsOptional()
  @IsBoolean()
  includeInactive?: boolean;
}


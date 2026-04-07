import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min } from 'class-validator';

// Inventory Item DTOs
export class CreateInventoryItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isRentable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalPrice?: number;

  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateInventoryItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isRentable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalPrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  category?: string;
}

// Inventory Rental DTOs
export class CreateRentalDto {
  @IsString()
  inventoryItemId: string;

  @IsOptional()
  @IsString()
  rentedTo?: string; // Person ID

  @IsOptional()
  @IsString()
  rentedToName?: string; // External person name

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number; // Quantity to rent (default 1)

  @IsDateString()
  rentalDate: string;

  @IsOptional()
  @IsDateString()
  expectedReturn?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentalAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReturnRentalDto {
  @IsDateString()
  returnDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  paymentAmount?: number;

  @IsOptional()
  @IsString()
  paymentStatus?: string; // 'paid', 'pending', 'waived'

  @IsOptional()
  @IsString()
  paymentNotes?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class InventoryQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  rentableOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  includeInactive?: boolean;
}

// Quantity Adjustment DTOs
export class AdjustQuantityDto {
  @IsString()
  type: 'increase' | 'decrease';

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  reason: string; // For increase: donation, purchased, returned, other. For decrease: damaged, lost, sold, disposed, other

  @IsOptional()
  @IsString()
  notes?: string;
}


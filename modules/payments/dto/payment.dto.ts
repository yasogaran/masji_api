import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsIn,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// ============ PAYMENT TYPE DTOs ============

export class CreatePaymentTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount?: number; // 0 or not provided means variable amount

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['incoming', 'outgoing'])
  type?: string; // 'incoming' (income) or 'outgoing' (expense), defaults to 'incoming'

  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // Defaults to true if not provided
}

export class UpdatePaymentTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['incoming', 'outgoing'])
  type?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ============ OTHER PAYMENT DTOs ============

export class CreateOtherPaymentDto {
  @IsNotEmpty()
  @IsUUID()
  personId: string;

  @IsNotEmpty()
  @IsUUID()
  paymentTypeId: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  amount?: number; // If not provided, use the payment type's default amount

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsIn(['pending', 'paid', 'cancelled'])
  status?: string; // Defaults to 'pending' if not provided
}

export class RecordOtherPaymentDto {
  @IsNotEmpty()
  @IsUUID()
  paymentId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOtherPaymentDto {
  @IsOptional()
  @IsUUID()
  personId?: string;

  @IsOptional()
  @IsUUID()
  paymentTypeId?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsIn(['pending', 'paid', 'cancelled'])
  status?: string;
}

// ============ QUERY DTOs ============

export class OtherPaymentQueryDto {
  @IsOptional()
  @IsUUID()
  paymentTypeId?: string;

  @IsOptional()
  @IsUUID()
  personId?: string;

  @IsOptional()
  @IsIn(['pending', 'paid', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(2020)
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 50;
}


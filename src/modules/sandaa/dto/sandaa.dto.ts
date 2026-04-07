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
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============ CONFIG DTOs ============

export class CreateSandaaConfigDto {
  @IsOptional()
  @IsUUID()
  mahallaId?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount: number;

  @IsOptional()
  @IsIn(['monthly', 'annually'])
  frequency?: string = 'monthly';

  @IsOptional()
  @IsIn(['family_head', 'all_adults'])
  whoPays?: string = 'family_head';

  @IsNotEmpty()
  @IsDateString()
  effectiveFrom: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}

export class UpdateSandaaConfigDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsOptional()
  @IsIn(['monthly', 'annually'])
  frequency?: string;

  @IsOptional()
  @IsDateString()
  effectiveTo?: string;
}

// ============ PAYMENT DTOs ============

export class RecordPaymentDto {
  @IsNotEmpty()
  @IsUUID()
  paymentId: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  paidAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class BulkRecordPaymentsDto {
  @IsNotEmpty()
  payments: {
    paymentId: string;
    paidAmount?: number;
    notes?: string;
  }[];
}

export class GeneratePaymentsDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number;

  @IsOptional()
  @IsUUID()
  mahallaId?: string;
}

// ============ QUERY DTOs ============

export class SandaaPaymentQueryDto {
  @IsOptional()
  @IsUUID()
  mahallaId?: string;

  @IsOptional()
  @IsUUID()
  familyId?: string;

  @IsOptional()
  @IsIn(['pending', 'paid', 'partial', 'waived'])
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsString()
  search?: string;

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

// ============ ELIGIBILITY DTOs ============

export class UpdateFamilyEligibilityDto {
  @IsNotEmpty()
  @IsUUID()
  familyId: string;

  @IsNotEmpty()
  @IsBoolean()
  isSandaaEligible: boolean;

  @IsOptional()
  @IsString()
  sandaaExemptReason?: string;
}


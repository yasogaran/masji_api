import { IsString, IsNumber, IsOptional, IsUUID, IsDateString, IsEnum, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

// Enums
export enum ZakathPeriodStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ZakathRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISTRIBUTED = 'distributed',
  PARTIAL = 'partial',
}

// Category DTOs
export class CreateZakathCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameArabic?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateZakathCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nameArabic?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// Period/Cycle DTOs
export class CreateZakathPeriodDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  hijriMonth?: number;

  @IsNumber()
  hijriYear: number;

  @IsOptional()
  @IsDateString()
  gregorianStart?: string;

  @IsOptional()
  @IsDateString()
  gregorianEnd?: string;
}

export class UpdateZakathPeriodDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  hijriMonth?: number;

  @IsOptional()
  @IsNumber()
  hijriYear?: number;

  @IsOptional()
  @IsDateString()
  gregorianStart?: string;

  @IsOptional()
  @IsDateString()
  gregorianEnd?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CompleteCycleDto {
  @IsOptional()
  @IsString()
  notes?: string;
}

// Collection DTOs
export class CreateZakathCollectionDto {
  @IsUUID()
  zakathPeriodId: string;

  @IsOptional()
  @IsUUID()
  donorId?: string;

  @IsOptional()
  @IsString()
  donorName?: string;

  @IsOptional()
  @IsString()
  donorPhone?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsDateString()
  collectionDate: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateZakathCollectionDto {
  @IsOptional()
  @IsUUID()
  donorId?: string;

  @IsOptional()
  @IsString()
  donorName?: string;

  @IsOptional()
  @IsString()
  donorPhone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsDateString()
  collectionDate?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

// Request DTOs
export class CreateZakathRequestDto {
  @IsUUID()
  zakathPeriodId: string;

  @IsOptional()
  @IsUUID()
  requesterId?: string; // Optional for external requesters

  @IsUUID()
  categoryId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amountRequested: number;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  supportingDocs?: string;

  // External requester fields
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @IsOptional()
  @IsString()
  externalName?: string;

  @IsOptional()
  @IsString()
  externalPhone?: string;

  @IsOptional()
  @IsString()
  externalNic?: string;

  @IsOptional()
  @IsString()
  externalAddress?: string;
}

export class UpdateZakathRequestDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amountRequested?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  supportingDocs?: string;
}

export class ApproveRequestDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amountApproved: number;

  @IsOptional()
  @IsString()
  decisionNotes?: string;
}

export class RejectRequestDto {
  @IsString()
  decisionNotes: string;
}

// Distribution DTOs
export class CreateZakathDistributionDto {
  @IsUUID()
  zakathRequestId: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

// Query DTOs
export class ZakathPeriodQueryDto {
  @IsOptional()
  @IsEnum(ZakathPeriodStatus)
  status?: ZakathPeriodStatus;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

export class ZakathCollectionQueryDto {
  @IsOptional()
  @IsUUID()
  zakathPeriodId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

export class ZakathRequestQueryDto {
  @IsOptional()
  @IsUUID()
  zakathPeriodId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(ZakathRequestStatus)
  status?: ZakathRequestStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}


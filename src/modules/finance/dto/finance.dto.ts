import { IsString, IsOptional, IsNumber, IsUUID, IsDateString, IsBoolean, IsEnum, Min } from 'class-validator';

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHEQUE = 'cheque',
  ONLINE = 'online',
}

// Income Category DTOs
export class CreateIncomeCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateIncomeCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

// Expense Category DTOs
export class CreateExpenseCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateExpenseCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

// Income DTOs
export class CreateIncomeDto {
  @IsString()
  @IsOptional()
  receiptNumber?: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  sourceType?: string;

  @IsUUID()
  @IsOptional()
  payerId?: string;

  @IsString()
  @IsOptional()
  payerName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  transactionDate: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateIncomeDto {
  @IsString()
  @IsOptional()
  receiptNumber?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  sourceType?: string;

  @IsUUID()
  @IsOptional()
  payerId?: string;

  @IsString()
  @IsOptional()
  payerName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  transactionDate?: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

// Expense DTOs
export class CreateExpenseDto {
  @IsString()
  @IsOptional()
  voucherNumber?: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  payeeType?: string;

  @IsUUID()
  @IsOptional()
  payeeId?: string;

  @IsString()
  @IsOptional()
  payeeName?: string;

  @IsString()
  description: string;

  @IsDateString()
  transactionDate: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateExpenseDto {
  @IsString()
  @IsOptional()
  voucherNumber?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  payeeType?: string;

  @IsUUID()
  @IsOptional()
  payeeId?: string;

  @IsString()
  @IsOptional()
  payeeName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  transactionDate?: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

// Query DTOs
export class FinanceQueryDto {
  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  month?: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}

// Report DTOs
export class FinanceReportDto {
  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  month?: number;
}


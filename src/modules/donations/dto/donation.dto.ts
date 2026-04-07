import { IsString, IsOptional, IsNumber, IsUUID, IsDateString, IsBoolean, IsEnum, Min } from 'class-validator';

export enum DonationType {
  MONEY = 'money',
  GOODS = 'goods',
}

export class CreateDonationCategoryDto {
  @IsString()
  name: string;

  @IsEnum(['money', 'goods'])
  type: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateDonationCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['money', 'goods'])
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateDonationDto {
  @IsUUID()
  @IsOptional()
  donorId?: string;

  @IsString()
  @IsOptional()
  donorName?: string;

  @IsString()
  @IsOptional()
  donorPhone?: string;

  @IsUUID()
  categoryId: string;

  @IsEnum(DonationType)
  donationType: DonationType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  itemDescription?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedValue?: number;

  @IsDateString()
  donationDate: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDonationDto {
  @IsUUID()
  @IsOptional()
  donorId?: string;

  @IsString()
  @IsOptional()
  donorName?: string;

  @IsString()
  @IsOptional()
  donorPhone?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsEnum(DonationType)
  @IsOptional()
  donationType?: DonationType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  itemDescription?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedValue?: number;

  @IsDateString()
  @IsOptional()
  donationDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateDistributionDto {
  @IsUUID()
  @IsOptional()
  recipientId?: string;

  @IsString()
  @IsOptional()
  recipientName?: string;

  @IsString()
  @IsOptional()
  recipientPhone?: string;

  @IsString()
  @IsOptional()
  recipientAddress?: string;

  @IsUUID()
  categoryId: string;

  @IsEnum(DonationType)
  distributionType: DonationType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  itemDescription?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsDateString()
  distributionDate: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDistributionDto {
  @IsUUID()
  @IsOptional()
  recipientId?: string;

  @IsString()
  @IsOptional()
  recipientName?: string;

  @IsString()
  @IsOptional()
  recipientPhone?: string;

  @IsString()
  @IsOptional()
  recipientAddress?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsEnum(DonationType)
  @IsOptional()
  distributionType?: DonationType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  itemDescription?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsDateString()
  @IsOptional()
  distributionDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class DonationQueryDto {
  @IsNumber()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  type?: string;

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

export class DistributionQueryDto {
  @IsNumber()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  type?: string;

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


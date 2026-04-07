import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, IsArray, IsUUID } from 'class-validator';

// Kurbaan Period DTOs
export class CreateKurbaanPeriodDto {
  @IsString()
  name: string;

  @IsNumber()
  hijriYear: number;

  @IsOptional()
  @IsDateString()
  gregorianDate?: string;
}

export class UpdateKurbaanPeriodDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  hijriYear?: number;

  @IsOptional()
  @IsDateString()
  gregorianDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class KurbaanPeriodQueryDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

// Kurbaan Participant DTOs
export class CreateKurbaanParticipantDto {
  @IsUUID()
  kurbaanPeriodId: string;

  @IsOptional()
  @IsUUID()
  familyHeadId?: string; // Optional for external families

  // External family fields
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
  externalAddress?: string;

  @IsOptional()
  @IsNumber()
  externalPeopleCount?: number;
}

export class BulkCreateParticipantsDto {
  @IsUUID()
  kurbaanPeriodId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  familyHeadIds: string[];
}

export class RegisterAllFamiliesDto {
  @IsUUID()
  kurbaanPeriodId: string;

  @IsOptional()
  @IsUUID()
  mahallaId?: string;
}

export class MarkDistributedDto {
  @IsOptional()
  @IsString()
  notes?: string;
}

export class KurbaanParticipantQueryDto {
  @IsOptional()
  @IsUUID()
  kurbaanPeriodId?: string;

  @IsOptional()
  @IsUUID()
  mahallaId?: string;

  @IsOptional()
  @IsBoolean()
  isDistributed?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

// Report DTO
export class KurbaanReportDto {
  period: {
    id: string;
    name: string;
    hijriYear: number;
    gregorianDate: Date | null;
    isActive: boolean;
  };
  summary: {
    totalParticipants: number;
    distributed: number;
    pending: number;
    distributionPercentage: number;
  };
  byMahalla: {
    mahallaId: string;
    mahallaName: string;
    total: number;
    distributed: number;
    pending: number;
  }[];
}


import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Note: CreateFamilyDto is no longer needed since families are created implicitly
// when a Person is created with isFamilyHead = true

export class UpdateFamilyDto {
  @IsString()
  @IsOptional()
  familyName?: string;

  @IsBoolean()
  @IsOptional()
  isSandaaEligible?: boolean;

  @IsString()
  @IsOptional()
  sandaaExemptReason?: string;
}

export class QueryFamiliesDto {
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  mahallaId?: string;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsOptional()
  isSandaaEligible?: boolean;
}

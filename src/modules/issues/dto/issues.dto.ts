import {
  IsString,
  IsOptional,
  IsDateString,
  IsIn,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIssueDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  raisedBy?: string;

  @IsDateString()
  raisedDate: string;

  @IsOptional()
  @IsIn(['open', 'in_progress', 'resolved', 'closed'])
  status?: string;
}

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['open', 'in_progress', 'resolved', 'closed'])
  status?: string;
}

export class ResolveIssueDto {
  @IsString()
  resolution: string;

  @IsDateString()
  resolvedDate: string;
}

export class IssueQueryDto {
  @IsOptional()
  @IsIn(['open', 'in_progress', 'resolved', 'closed'])
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}







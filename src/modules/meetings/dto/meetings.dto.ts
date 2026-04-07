import {
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
  IsArray,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMeetingDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsDateString()
  meetingDate: string;

  @IsOptional()
  @IsString()
  meetingTime?: string; // HH:mm format

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsString()
  attendees?: string;

  @IsOptional()
  @IsString()
  agenda?: string;

  @IsOptional()
  @IsString()
  minutes?: string;
}

export class UpdateMeetingDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsDateString()
  meetingDate?: string;

  @IsOptional()
  @IsString()
  meetingTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @IsOptional()
  @IsString()
  attendees?: string;

  @IsOptional()
  @IsString()
  agenda?: string;

  @IsOptional()
  @IsString()
  minutes?: string;
}

export class CreateDecisionDto {
  @IsString()
  decision: string;

  @IsOptional()
  @IsUUID()
  relatedIssueId?: string;
}

export class MeetingQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}







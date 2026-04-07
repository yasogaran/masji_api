import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateMosqueDto {
  @IsNotEmpty()
  @IsString()
  mahallaId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsIn(['parent', 'sub'])
  mosqueType?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}


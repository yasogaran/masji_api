import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMahallaDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isOutJamath?: boolean;
}


import { IsNotEmpty, IsString, IsEmail, IsOptional, IsArray, ValidateNested, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

class PermissionDto {
  @IsNotEmpty()
  permissionId: number;

  @IsOptional()
  @IsString()
  mahallaId?: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  personId: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions?: PermissionDto[];
}


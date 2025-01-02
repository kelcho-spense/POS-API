// company.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCompanyDto {
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  email?: string;

  @IsOptional()
  @IsString()
  taxId?: string;
}

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}

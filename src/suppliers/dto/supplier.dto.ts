// supplier.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @IsNotEmpty()
  @IsString()
  supplierName: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}

// product.dto.ts

import { PartialType } from '@nestjs/swagger';
import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsInt()
  supplierId?: number;

  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'unitPrice must be a decimal with 2 decimal places' },
  )
  unitPrice: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'taxRate must be a decimal with 2 decimal places' },
  )
  taxRate?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

// sale-item.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { IsDecimal, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSaleItemDto {
  @IsNotEmpty()
  @IsInt()
  saleId: number;

  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'unitPrice must be a decimal with 2 decimal places' },
  )
  unitPrice: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'taxAmount must be a decimal with 2 decimal places' },
  )
  taxAmount?: string;

  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'subtotal must be a decimal with 2 decimal places' },
  )
  subtotal: string;
}

export class UpdateSaleItemDto extends PartialType(CreateSaleItemDto) {}

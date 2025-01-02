// sale.dto.ts

import { PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsDecimal,
  IsNotEmpty,
} from 'class-validator';
import { SaleStatus } from '@prisma/client';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'subtotal must be a decimal with 2 decimal places' },
  )
  subtotal: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'taxAmount must be a decimal with 2 decimal places' },
  )
  taxAmount?: string;

  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'totalAmount must be a decimal with 2 decimal places' },
  )
  totalAmount: string;

  @IsOptional()
  @IsEnum(SaleStatus, {
    message: 'Invalid status. Must be one of: COMPLETED, REFUNDED, PENDING',
  })
  status?: SaleStatus;
}

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}

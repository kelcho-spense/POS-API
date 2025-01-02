// purchase-order.dto.ts

import { PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsDecimal,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { PurchaseOrderStatus } from '@prisma/client';

export class CreatePurchaseOrderDto {
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @IsNotEmpty()
  @IsInt()
  supplierId: number;

  @IsOptional()
  @IsDateString({}, { message: 'Expected delivery date must be a valid date' })
  expectedDeliveryDate?: string;

  @IsOptional()
  @IsEnum(PurchaseOrderStatus, {
    message: 'Invalid status. Must be one of: PENDING, RECEIVED, CANCELED',
  })
  status?: PurchaseOrderStatus;

  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'totalAmount must be a decimal with 2 decimal places' },
  )
  totalAmount: string;

  @IsOptional()
  @IsInt()
  createdById?: number;
}

export class UpdatePurchaseOrderDto extends PartialType(
  CreatePurchaseOrderDto,
) {}

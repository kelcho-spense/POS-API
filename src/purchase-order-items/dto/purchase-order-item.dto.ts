// purchase-order-item.dto.ts

import { PartialType } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePurchaseOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  purchaseOrderId: number;

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

  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'subtotal must be a decimal with 2 decimal places' },
  )
  subtotal: string;
}

export class UpdatePurchaseOrderItemDto extends PartialType(
  CreatePurchaseOrderItemDto,
) {}

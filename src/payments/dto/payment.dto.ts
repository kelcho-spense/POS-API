// payment.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsDecimal,
  IsNotEmpty,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsInt()
  saleId: number;

  @IsNotEmpty()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'amount must be a decimal with 2 decimal places' },
  )
  amount: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod, {
    message:
      'Invalid payment method. Must be one of: CASH, CREDIT_CARD, DEBIT_CARD, MOBILE_PAYMENT, OTHER',
  })
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  paymentReference?: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}

// customer.dto.ts

import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

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

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

// user.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(UserRole, {
    message:
      'Invalid role. Must be one of: ADMIN, MANAGER, CASHIER, INVENTORY_CLERK, ACCOUNTANT, AUDITOR, SUPPORT_STAFF, MARKETING_MANAGER, SUPPLIER',
  })
  role: UserRole;

  @IsOptional()
  @IsString()
  username: string;

  // @IsNotEmpty()
  // @IsNumber()
  // companyId: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

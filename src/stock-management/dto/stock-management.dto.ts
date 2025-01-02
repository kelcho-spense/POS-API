// stock-movement.dto.ts

import { PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ManagementType } from '@prisma/client';

export class CreateStockManagementDto {
  @IsNotEmpty()
  @IsInt()
  inventoryId: number;

  @IsNotEmpty()
  @IsEnum(ManagementType, {
    message:
      'Invalid movement type. Must be one of: ADDITION, SUBTRACTION, ADJUSTMENT',
  })
  ManagementType: ManagementType;

  @IsNotEmpty()
  @IsInt()
  quantityChange: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsInt()
  performedById?: number;
}

export class UpdateStockManagementDto extends PartialType(
  CreateStockManagementDto,
) {}

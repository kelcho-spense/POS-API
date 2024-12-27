// stock-movement.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { MovementType } from '@prisma/client';

export class CreateStockMovementDto {
  @IsNotEmpty()
  @IsInt()
  inventoryId: number;

  @IsNotEmpty()
  @IsEnum(MovementType, {
    message:
      'Invalid movement type. Must be one of: ADDITION, SUBTRACTION, ADJUSTMENT',
  })
  movementType: MovementType;

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

export class UpdateStockMovementDto extends PartialType(
  CreateStockMovementDto,
) {}

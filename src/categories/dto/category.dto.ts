// category.dto.ts

import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsInt()
  companyId: number;

  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

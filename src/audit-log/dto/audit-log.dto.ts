// audit-log.dto.ts

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsJSON,
  IsNotEmpty,
} from 'class-validator';
import { Operation } from '@prisma/client';

export class ReadAuditLogDto {
  @IsNotEmpty()
  @IsString()
  tableName: string;

  @IsNotEmpty()
  @IsInt()
  recordId: number;

  @IsNotEmpty()
  @IsEnum(Operation, {
    message: 'Invalid operation. Must be one of: INSERT, UPDATE, DELETE',
  })
  operation: Operation;

  @IsOptional()
  @IsInt()
  changedById?: number;

  @IsOptional()
  @IsJSON()
  oldData?: any;

  @IsOptional()
  @IsJSON()
  newData?: any;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateStockManagementDto } from './create-stock-management.dto';

export class UpdateStockManagementDto extends PartialType(
  CreateStockManagementDto,
) {}

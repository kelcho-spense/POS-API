import { Module } from '@nestjs/common';
import { StockManagementService } from './stock-management.service';
import { StockManagementController } from './stock-management.controller';

@Module({
  controllers: [StockManagementController],
  providers: [StockManagementService],
})
export class StockManagementModule {}

import { Module } from '@nestjs/common';
import { StockManagementService } from './stock-management.service';
import { StockManagementController } from './stock-management.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [StockManagementController],
  providers: [StockManagementService, DatabaseService],
})
export class StockManagementModule {}

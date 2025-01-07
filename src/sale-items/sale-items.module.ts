import { Module } from '@nestjs/common';
import { SaleItemsService } from './sale-items.service';
import { SaleItemsController } from './sale-items.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [SaleItemsController],
  providers: [SaleItemsService, DatabaseService],
})
export class SaleItemsModule {}

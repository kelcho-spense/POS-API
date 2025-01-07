import { Module } from '@nestjs/common';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import { PurchaseOrderItemsController } from './purchase-order-items.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [PurchaseOrderItemsController],
  providers: [PurchaseOrderItemsService, DatabaseService],
})
export class PurchaseOrderItemsModule {}

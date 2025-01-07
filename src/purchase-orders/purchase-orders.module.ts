import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [PurchaseOrdersController],
  providers: [PurchaseOrdersService, DatabaseService],
})
export class PurchaseOrdersModule {}

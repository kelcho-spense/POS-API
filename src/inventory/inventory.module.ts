import { Logger, Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, DatabaseService, Logger],
})
export class InventoryModule {}

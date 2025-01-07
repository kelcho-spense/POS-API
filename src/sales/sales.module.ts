import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [SalesController],
  providers: [SalesService, DatabaseService],
})
export class SalesModule {}

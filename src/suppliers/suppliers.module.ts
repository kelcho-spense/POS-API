import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, DatabaseService],
})
export class SuppliersModule {}

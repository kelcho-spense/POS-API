import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, DatabaseService],
})
export class CustomersModule {}

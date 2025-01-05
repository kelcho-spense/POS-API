import { Injectable } from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { Customer } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CustomersService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createCustomerData: CreateCustomerDto): Promise<Customer> {
    return this.databaseService.customer.create({
      data: createCustomerData,
    });
  }

  findAll(): Promise<Customer[]> {
    return this.databaseService.customer.findMany();
  }

  findOne(customerId: number): Promise<Customer> {
    return this.databaseService.customer.findUnique({
      where: { customerId },
    });
  }

  update(
    customerId: number,
    updateCustomerData: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.databaseService.customer.update({
      where: { customerId },
      data: updateCustomerData,
    });
  }

  remove(customerId: number) {
    return this.databaseService.customer.delete({
      where: { customerId },
    });
  }
}

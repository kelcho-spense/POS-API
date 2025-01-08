import { Injectable } from '@nestjs/common';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { DatabaseService } from 'src/database/database.service';
import { Supplier } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return await this.databaseService.supplier.create({
      data: createSupplierDto,
    });
  }

  async findAll(): Promise<Supplier[]> {
    return await this.databaseService.supplier.findMany();
  }

  async findOne(supplierId: number): Promise<Supplier> {
    return await this.databaseService.supplier.findUnique({
      where: { supplierId },
    });
  }

  async update(
    supplierId: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return await this.databaseService.supplier.update({
      where: { supplierId },
      data: updateSupplierDto,
    });
  }

  async remove(supplierId: number): Promise<Supplier> {
    return await this.databaseService.supplier.delete({
      where: { supplierId },
    });
  }
}

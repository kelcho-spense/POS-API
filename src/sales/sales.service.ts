import { Injectable } from '@nestjs/common';
import { CreateSaleDto, UpdateSaleDto } from './dto/sale.dto';
import { DatabaseService } from 'src/database/database.service';
import { Sale } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createSaleData: CreateSaleDto): Promise<Sale> {
    return await this.databaseService.sale.create({
      data: createSaleData,
    });
  }

  async findAll(): Promise<Sale[]> {
    return await this.databaseService.sale.findMany();
  }

  async findOne(saleId: number): Promise<Sale> {
    return await this.databaseService.sale.findUnique({
      where: { saleId },
    });
  }

  async update(saleId: number, updateSaleData: UpdateSaleDto): Promise<Sale> {
    return await this.databaseService.sale.update({
      where: { saleId },
      data: updateSaleData,
    });
  }

  async remove(saleId: number): Promise<Sale> {
    return await this.databaseService.sale.delete({
      where: { saleId },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateSaleItemDto, UpdateSaleItemDto } from './dto/sale-item.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SaleItemsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createSaleItemData: CreateSaleItemDto) {
    return await this.databaseService.saleItem.create({
      data: createSaleItemData,
    });
  }

  async findAll() {
    return await this.databaseService.saleItem.findMany();
  }

  async findOne(saleItemId: number) {
    return await this.databaseService.saleItem.findUnique({
      where: { saleItemId },
    });
  }
  async update(saleItemId: number, updateSaleItemData: UpdateSaleItemDto) {
    return await this.databaseService.saleItem.update({
      where: { saleItemId },
      data: updateSaleItemData,
    });
  }

  async remove(saleItemId: number) {
    return await this.databaseService.saleItem.delete({
      where: { saleItemId },
    });
  }
}

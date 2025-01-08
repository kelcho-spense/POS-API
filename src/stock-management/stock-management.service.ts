import { Injectable } from '@nestjs/common';
import {
  CreateStockManagementDto,
  UpdateStockManagementDto,
} from './dto/stock-management.dto';
import { DatabaseService } from 'src/database/database.service';
import { StockManagement } from '@prisma/client';

@Injectable()
export class StockManagementService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createStockManagementData: CreateStockManagementDto,
  ): Promise<StockManagement> {
    return this.databaseService.stockManagement.create({
      data: createStockManagementData,
    });
  }

  async findAll(): Promise<StockManagement[]> {
    return this.databaseService.stockManagement.findMany();
  }

  async findOne(stockManagementId: number): Promise<StockManagement> {
    return this.databaseService.stockManagement.findUnique({
      where: { stockManagementId },
    });
  }

  async update(
    stockManagementId: number,
    updateStockManagementData: UpdateStockManagementDto,
  ): Promise<StockManagement> {
    return this.databaseService.stockManagement.update({
      where: { stockManagementId },
      data: updateStockManagementData,
    });
  }

  async remove(stockManagementId: number): Promise<StockManagement> {
    return this.databaseService.stockManagement.delete({
      where: { stockManagementId },
    });
  }
}

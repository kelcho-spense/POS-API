import { Injectable } from '@nestjs/common';
import {
  CreateStockManagementDto,
  UpdateStockManagementDto,
} from './dto/stock-management.dto';
import { DatabaseService } from 'src/database/database.service';
import { ManagementType, StockManagement } from '@prisma/client';

@Injectable()
export class StockManagementService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Basic creation without a transaction
   */
  async create(
    createStockManagementData: CreateStockManagementDto,
  ): Promise<StockManagement> {
    return this.databaseService.stockManagement.create({
      data: createStockManagementData,
    });
  }

  /**
   * Basic CRUD and queries
   */
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

  /**
   * Transaction-based creation that also updates Inventory quantity.
   */

  async createStockMovementAndUpdateInventory(
    data: CreateStockManagementDto,
  ): Promise<{
    stockMovement: StockManagement;
    updatedInventoryQuantity: number;
  }> {
    return this.databaseService.$transaction(async (tx) => {
      // 1. Create the stock movement record
      const stockMovement = await tx.stockManagement.create({
        data,
      });

      // 2. Retrieve current inventory
      const inventory = await tx.inventory.findUnique({
        where: { inventoryId: data.inventoryId },
      });

      if (!inventory) {
        throw new Error('Inventory not found');
      }

      // 3. Calculate the new quantity based on the managementType
      // (Assuming ManagementType can be ADDITION, SUBTRACTION, ADJUSTMENT, etc.)
      let newQuantity = inventory.quantity;

      switch (stockMovement.stockManagementType) {
        case ManagementType.ADDITION:
          newQuantity += stockMovement.quantityChange;
          break;
        case ManagementType.SUBTRACTION:
          newQuantity -= stockMovement.quantityChange;
          if (newQuantity < 0) {
            throw new Error('Cannot subtract more than current inventory');
          }
          break;
        case ManagementType.ADJUSTMENT:
          // In an adjustment scenario, you may interpret quantityChange
          // as the final absolute quantity or a delta. Adapt as needed.
          newQuantity = stockMovement.quantityChange;
          break;
      }

      // 4. Update the inventory
      await tx.inventory.update({
        where: { inventoryId: inventory.inventoryId },
        data: { quantity: newQuantity, lastUpdated: new Date() },
      });

      return {
        stockMovement,
        updatedInventoryQuantity: newQuantity,
      };
    });
  }
}

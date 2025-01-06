import { Injectable, Logger } from '@nestjs/common';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';
import { DatabaseService } from 'src/database/database.service';
import { Inventory } from '@prisma/client';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  // Helper Methods
  async checkReorderLevel(inventoryId: number): Promise<void> {
    const inventory = await this.databaseService.inventory.findUnique({
      where: { inventoryId },
      include: { product: true },
    });

    if (inventory.quantity <= inventory.reorderLevel) {
      this.notifyLowStock(inventory);
    }
  }

  private notifyLowStock(inventory: any): void {
    this.logger.warn(
      `Low stock alert: Product ${inventory.product.productName} (ID: ${inventory.productId}) 
      has reached reorder level. Current quantity: ${inventory.quantity}`,
    );
    // TODO: Implement your notification logic here (email, SMS, etc.)
  }

  // CRUD Methods
  async create(createInventoryData: CreateInventoryDto): Promise<Inventory> {
    return await this.databaseService.inventory.create({
      data: createInventoryData,
    });
  }

  async findAll(): Promise<Inventory[]> {
    return await this.databaseService.inventory.findMany();
  }

  async findOne(inventoryId: number): Promise<Inventory> {
    return await this.databaseService.inventory.findUnique({
      where: { inventoryId },
    });
  }

  async update(
    inventoryId: number,
    updateInventoryData: UpdateInventoryDto,
  ): Promise<Inventory> {
    return await this.databaseService.inventory.update({
      where: { inventoryId },
      data: updateInventoryData,
    });
  }

  async remove(inventoryId: number): Promise<Inventory> {
    return await this.databaseService.inventory.delete({
      where: { inventoryId },
    });
  }
}

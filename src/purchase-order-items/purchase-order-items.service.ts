import { Injectable } from '@nestjs/common';
import {
  CreatePurchaseOrderItemDto,
  UpdatePurchaseOrderItemDto,
} from './dto/purchase-order-item.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PurchaseOrderItemsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPurchaseOrderItemData: CreatePurchaseOrderItemDto) {
    return await this.databaseService.purchaseOrderItem.create({
      data: createPurchaseOrderItemData,
    });
  }

  async findAll() {
    return await this.databaseService.purchaseOrderItem.findMany();
  }

  async findOne(purchaseOrderItemId: number) {
    return await this.databaseService.purchaseOrderItem.findUnique({
      where: { purchaseOrderItemId },
    });
  }

  async update(
    purchaseOrderItemId: number,
    updatePurchaseOrderItemData: UpdatePurchaseOrderItemDto,
  ) {
    return await this.databaseService.purchaseOrderItem.update({
      where: { purchaseOrderItemId },
      data: updatePurchaseOrderItemData,
    });
  }

  async remove(purchaseOrderItemId: number) {
    return await this.databaseService.purchaseOrderItem.delete({
      where: { purchaseOrderItemId },
    });
  }
}

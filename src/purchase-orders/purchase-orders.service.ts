import { Injectable } from '@nestjs/common';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './dto/purchase-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { PurchaseOrder } from '@prisma/client';

@Injectable()
export class PurchaseOrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createPurchaseOrderData: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return await this.databaseService.purchaseOrder.create({
      data: createPurchaseOrderData,
    });
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return await this.databaseService.purchaseOrder.findMany();
  }

  async findOne(purchaseOrderId: number): Promise<PurchaseOrder> {
    return await this.databaseService.purchaseOrder.findUnique({
      where: { purchaseOrderId },
    });
  }

  async update(
    purchaseOrderId: number,
    updatePurchaseOrderData: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return await this.databaseService.purchaseOrder.update({
      where: { purchaseOrderId },
      data: updatePurchaseOrderData,
    });
  }
  async remove(purchaseOrderId: number): Promise<PurchaseOrder> {
    return await this.databaseService.purchaseOrder.delete({
      where: { purchaseOrderId },
    });
  }
}

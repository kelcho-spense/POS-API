import { Injectable } from '@nestjs/common';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './dto/purchase-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { PurchaseOrder, PurchaseOrderStatus } from '@prisma/client';

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

  /**
   * Transaction-based method to "receive" a purchase order.
   * Steps:
   * 1) Update the purchase order status to RECEIVED
   * 2) For each PurchaseOrderItem, update the inventory quantity
   */
  async receivePurchaseOrder(purchaseOrderId: number): Promise<PurchaseOrder> {
    // Start a transaction
    return this.databaseService.$transaction(async (tx) => {
      // 1. Fetch the PO (including items)
      const po = await tx.purchaseOrder.findUnique({
        where: { purchaseOrderId },
        include: {
          purchaseOrderItems: true,
        },
      });
      if (!po) {
        throw new Error('Purchase Order not found');
      }

      // 2. Update the PO status to RECEIVED (if it’s pending)
      if (po.status === PurchaseOrderStatus.RECEIVED) {
        throw new Error('Purchase Order is already received');
      }

      const updatedPO = await tx.purchaseOrder.update({
        where: { purchaseOrderId },
        data: {
          status: PurchaseOrderStatus.RECEIVED,
          updatedAt: new Date(),
        },
        include: {
          purchaseOrderItems: true, // re-include for the final return
        },
      });

      // 3. For each item, update inventory
      for (const item of updatedPO.purchaseOrderItems) {
        if (!item.productId) {
          continue; // skip items that don't have a linked product
        }

        // Get the current inventory for this product
        const inventory = await tx.inventory.findUnique({
          where: { productId: item.productId },
        });

        // If inventory does not exist yet for this product, create it
        if (!inventory) {
          await tx.inventory.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              reorderLevel: 0,
              lastUpdated: new Date(),
            },
          });
        } else {
          // Otherwise, increment the quantity
          await tx.inventory.update({
            where: { inventoryId: inventory.inventoryId },
            data: {
              quantity: inventory.quantity + item.quantity,
              lastUpdated: new Date(),
            },
          });
        }
      }

      return updatedPO;
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateSaleDto, UpdateSaleDto } from './dto/sale.dto';
import { DatabaseService } from 'src/database/database.service';
import { Sale, SaleItem } from '@prisma/client';
import { CreateSaleItemDto } from 'src/sale-items/dto/sale-item.dto';

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

  /**
   * Transaction-based creation of a Sale, its SaleItems, and Inventory updates.
   * Assumes you pass in a custom DTO or object that includes sale data + items array.
   */
  async createSaleWithItemsAndUpdateInventory(input: {
    saleData: CreateSaleDto;
    saleItems: CreateSaleItemDto[];
  }): Promise<Sale> {
    return this.databaseService.$transaction(async (tx) => {
      // 1. Create the Sale
      const sale = await tx.sale.create({
        data: {
          ...input.saleData,
          // optional: you can also create saleItems inline via nested writes if you want
        },
      });

      // 2. Create each SaleItem, adjusting inventory
      const createdItems: SaleItem[] = [];

      for (const itemData of input.saleItems) {
        // 2.a) Create the SaleItem, linking to the above sale
        const saleItem = await tx.saleItem.create({
          data: {
            subtotal: itemData.subtotal,
            taxAmount: itemData.taxAmount,
            product: {
              connect: { productId: itemData.productId },
            },
            quantity: itemData.quantity,
            unitPrice: itemData.unitPrice,
            sale: {
              connect: { saleId: sale.saleId },
            },
          },
        });
        createdItems.push(saleItem);

        // 2.b) Update inventory for the product sold
        if (itemData.productId) {
          const productId = itemData.productId;
          const inventory = await tx.inventory.findUnique({
            where: { productId },
          });
          if (!inventory) {
            throw new Error(`No inventory found for product ID ${productId}`);
          }
          if (inventory.quantity < saleItem.quantity) {
            throw new Error(
              `Not enough inventory to fulfill sale for product ID ${productId}`,
            );
          }

          await tx.inventory.update({
            where: { inventoryId: inventory.inventoryId },
            data: {
              quantity: inventory.quantity - saleItem.quantity,
              lastUpdated: new Date(),
            },
          });
        }
      }

      // 3. Optionally, recalc the sale's totals (subtotal, totalAmount, etc.) if needed
      //    Alternatively, you can pass them in directly in saleData

      // Return the full sale with items
      return tx.sale.findUnique({
        where: { saleId: sale.saleId },
        include: {
          customer: true,
          user: true,
          saleItems: true,
          payments: true,
        },
      });
    });
  }
}

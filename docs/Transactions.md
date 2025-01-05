Below is an updated version of the code that **adds transaction support** where multi-step operations require an “all-or-nothing” approach (i.e., all changes succeed or all changes fail). This is especially useful in business workflows like:

1. **Creating a Sale with multiple SaleItems** while updating the corresponding **Inventory**.  
2. **Receiving a Purchase Order** (changing its status to `RECEIVED`), creating or updating related PurchaseOrderItems, and updating **Inventory**.  
3. **Creating a StockMovement** that also updates **Inventory** quantities.

We’ll keep the original single-CRUD endpoints for basic usage, but we’ll **add** new service methods (and corresponding controller endpoints) that wrap complex, multi-step logic in **Prisma transactions**.

> **Note**: The code below focuses on the transaction additions. You should adapt each method to suit your exact business rules for “how many items you’re adding,” “which statuses update inventory,” “how to handle partial failures,” etc.

---

## 1. Stock Management (with Inventory Update)

When you create a new stock movement (e.g., ADDITION, SUBTRACTION, or ADJUSTMENT), you typically want to update the **inventory quantity** at the same time. Doing both in a transaction ensures the data stays consistent.

### `stock-management.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockManagement, Prisma, ManagementType } from '@prisma/client';

@Injectable()
export class StockManagementService {
  constructor(private prisma: PrismaService) {}

  /**
   * Basic creation without a transaction
   */
  async createStockMovement(data: Prisma.StockManagementCreateInput): Promise<StockManagement> {
    return this.prisma.stockManagement.create({ data });
  }

  /**
   * Basic CRUD and queries
   */
  async getAllStockMovements(): Promise<StockManagement[]> {
    return this.prisma.stockManagement.findMany({
      include: {
        inventory: true,
        performedBy: true,
      },
    });
  }

  async getStockMovementById(managementId: number): Promise<StockManagement | null> {
    return this.prisma.stockManagement.findUnique({
      where: { managementId },
      include: {
        inventory: true,
        performedBy: true,
      },
    });
  }

  async updateStockMovement(managementId: number, data: Prisma.StockManagementUpdateInput): Promise<StockManagement> {
    return this.prisma.stockManagement.update({
      where: { managementId },
      data,
    });
  }

  async deleteStockMovement(managementId: number): Promise<StockManagement> {
    return this.prisma.stockManagement.delete({
      where: { managementId },
    });
  }

  /**
   * Transaction-based creation that also updates Inventory quantity.
   * Assumes data.inventoryId is valid. Adjust logic to match your business rules.
   */
  async createStockMovementAndUpdateInventory(
    data: Prisma.StockManagementCreateInput,
  ): Promise<{ stockMovement: StockManagement; updatedInventoryQuantity: number }> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create the stock movement record
      const stockMovement = await tx.stockManagement.create({
        data,
      });

      // 2. Retrieve current inventory
      const inventory = await tx.inventory.findUnique({
        where: { inventoryId: data.inventory.connect?.inventoryId },
      });

      if (!inventory) {
        throw new Error('Inventory not found');
      }

      // 3. Calculate the new quantity based on the managementType
      // (Assuming ManagementType can be ADDITION, SUBTRACTION, ADJUSTMENT, etc.)
      let newQuantity = inventory.quantity;

      switch (stockMovement.managementType) {
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
```

### `stock-management.controller.ts` (new endpoint for transaction)

```ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { StockManagementService } from './stock-management.service';
import { Prisma } from '@prisma/client';

@Controller('stock-managements')
export class StockManagementController {
  constructor(private stockManagementService: StockManagementService) {}

  // Basic endpoints...

  @Post('with-inventory-update')
  async createWithInventoryUpdate(
    @Body() data: Prisma.StockManagementCreateInput,
  ) {
    return this.stockManagementService.createStockMovementAndUpdateInventory(data);
  }
}
```

You still have your original CRUD endpoints for simple usage, but now you also have `POST /stock-managements/with-inventory-update` for a **transaction-based** stock movement that updates the Inventory.

---

## 2. Receiving a Purchase Order

When you **receive** a purchase order (status changes from `PENDING` to `RECEIVED`), you may need to also update the **inventory** for each item in that purchase order. If you do these steps one by one and a failure occurs, you could end up with partial data. Using a transaction ensures atomicity.

### `purchase-order.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseOrder, Prisma, PurchaseOrderStatus } from '@prisma/client';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) {}

  // Basic CRUD methods...
  async createPurchaseOrder(data: Prisma.PurchaseOrderCreateInput): Promise<PurchaseOrder> {
    return this.prisma.purchaseOrder.create({ data });
  }

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return this.prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        createdBy: true,
        purchaseOrderItems: true,
      },
    });
  }

  async getPurchaseOrderById(purchaseOrderId: number): Promise<PurchaseOrder | null> {
    return this.prisma.purchaseOrder.findUnique({
      where: { purchaseOrderId },
      include: {
        supplier: true,
        createdBy: true,
        purchaseOrderItems: true,
      },
    });
  }

  async updatePurchaseOrder(purchaseOrderId: number, data: Prisma.PurchaseOrderUpdateInput): Promise<PurchaseOrder> {
    return this.prisma.purchaseOrder.update({
      where: { purchaseOrderId },
      data,
    });
  }

  async deletePurchaseOrder(purchaseOrderId: number): Promise<PurchaseOrder> {
    return this.prisma.purchaseOrder.delete({
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
    return this.prisma.$transaction(async (tx) => {
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
```

### `purchase-order.controller.ts` (new endpoint to “receive”)

```ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { Prisma } from '@prisma/client';

@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private purchaseOrderService: PurchaseOrderService) {}

  // Basic CRUD endpoints...

  @Patch(':id/receive')
  async receive(@Param('id') id: string) {
    return this.purchaseOrderService.receivePurchaseOrder(+id);
  }
}
```

You still have your standard CRUD endpoints, but now you can call `PATCH /purchase-orders/:id/receive` to mark a PO as received *and* update the inventory in a single **transaction**.

---

## 3. Creating a Sale with Items (and Updating Inventory)

When you create a new Sale with multiple SaleItems, you often want to **decrease** the inventory for each product sold. Doing this in one transaction avoids partial data if something goes wrong mid-operation.

### `sale.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Sale,
  Prisma,
  SaleItem,
} from '@prisma/client';

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

  // Basic CRUD methods...
  async createSale(data: Prisma.SaleCreateInput): Promise<Sale> {
    return this.prisma.sale.create({ data });
  }

  async getSales(): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      include: {
        customer: true,
        user: true,
        saleItems: true,
        payments: true,
      },
    });
  }

  async getSaleById(saleId: number): Promise<Sale | null> {
    return this.prisma.sale.findUnique({
      where: { saleId },
      include: {
        customer: true,
        user: true,
        saleItems: true,
        payments: true,
      },
    });
  }

  async updateSale(saleId: number, data: Prisma.SaleUpdateInput): Promise<Sale> {
    return this.prisma.sale.update({
      where: { saleId },
      data,
    });
  }

  async deleteSale(saleId: number): Promise<Sale> {
    return this.prisma.sale.delete({
      where: { saleId },
    });
  }

  /**
   * Transaction-based creation of a Sale, its SaleItems, and Inventory updates.
   * Assumes you pass in a custom DTO or object that includes sale data + items array.
   */
  async createSaleWithItemsAndUpdateInventory(input: {
    saleData: Prisma.SaleCreateInput;
    saleItems: Array<Prisma.SaleItemCreateWithoutSaleInput>;
  }): Promise<Sale> {
    return this.prisma.$transaction(async (tx) => {
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
            ...itemData,
            sale: {
              connect: { saleId: sale.saleId },
            },
          },
        });
        createdItems.push(saleItem);

        // 2.b) Update inventory for the product sold
        if (itemData.product?.connect?.productId) {
          const productId = itemData.product.connect.productId;
          const inventory = await tx.inventory.findUnique({
            where: { productId },
          });
          if (!inventory) {
            throw new Error(`No inventory found for product ID ${productId}`);
          }
          if (inventory.quantity < saleItem.quantity) {
            throw new Error(`Not enough inventory to fulfill sale for product ID ${productId}`);
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
```

### `sale.controller.ts` (new endpoint to create sale with items)

```ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { SaleService } from './sale.service';
import { Prisma } from '@prisma/client';

@Controller('sales')
export class SaleController {
  constructor(private saleService: SaleService) {}

  // Basic CRUD endpoints...

  /**
   * Example endpoint to create a sale with items in a transaction:
   *
   * Body structure might look like:
   * {
   *   saleData: {
   *     customer: { connect: { customerId: 1 } },
   *     user: { connect: { userId: 2 } },
   *     subtotal: "100",
   *     taxAmount: "5",
   *     totalAmount: "105"
   *   },
   *   saleItems: [
   *     {
   *       quantity: 2,
   *       unitPrice: "50",
   *       product: { connect: { productId: 10 } }
   *     }
   *   ]
   * }
   */
  @Post('with-items')
  createSaleWithItems(@Body() body: {
    saleData: Prisma.SaleCreateInput;
    saleItems: Array<Prisma.SaleItemCreateWithoutSaleInput>;
  }) {
    return this.saleService.createSaleWithItemsAndUpdateInventory(body);
  }
}
```

---

## Putting It All Together

- **Stock Management** now has `createStockMovementAndUpdateInventory()` for one-step stock changes.  
- **Purchase Order** now has `receivePurchaseOrder()` to set a PO to `RECEIVED` and update all item inventories in a transaction.  
- **Sale** now has `createSaleWithItemsAndUpdateInventory()` to create a sale, its items, and decrement inventory in one go.

All other modules (e.g., `Company`, `Category`, `Supplier`, `Customer`, `Payment`, `AuditLog`) generally have **single-table** operations and might not need a multi-step transaction unless you have more complex flows (like simultaneously creating multiple related records). You can still add or remove transaction usage based on your specific logic requirements.

### Important Notes

1. **Custom DTOs**:  
   - Typically, you wouldn’t pass raw `Prisma` types from the controller. You’d define DTO classes (e.g. `CreateSaleDto`) with [class-validator](https://docs.nestjs.com/techniques/validation) for request validation.  
   - The above examples show direct usage of `Prisma` input types for brevity.

2. **Error Handling**:  
   - We’ve used `throw new Error(...)` for demonstration. In production, you might use Nest’s `HttpException` or custom error classes.

3. **Isolation Levels**:  
   - Prisma currently uses the default isolation level of your database (often `READ COMMITTED` in PostgreSQL). For more advanced concurrency control, see [Prisma’s docs on transactions](https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions).

4. **Performance Considerations**:  
   - For large updates, you might batch or chunk updates inside a transaction.  
   - Keep transactions as short as possible to avoid locks.

With these transaction-based methods, you ensure that critical multi-step operations either **fully succeed** or **fully fail**, keeping your POS database in a consistent state.
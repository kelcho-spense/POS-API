Below is an example folder structure and sample code for a NestJS application that uses Prisma as the ORM to manage all of the resources defined in your `prisma.schema`. This includes CRUD operations (create, read, update, delete) plus listing (querying) data from each table. 

While this answer provides a lot of boilerplate, you may want to customize each service and controller to best suit your application’s business logic, validations, DTOs, etc.

---

## Folder Structure

A recommended structure might look like this (one module per resource):

```
src
├── app.module.ts
├── prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── company
│   ├── company.controller.ts
│   ├── company.service.ts
│   └── company.module.ts
├── user
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── category
│   ├── category.controller.ts
│   ├── category.service.ts
│   └── category.module.ts
├── supplier
│   ├── supplier.controller.ts
│   ├── supplier.service.ts
│   └── supplier.module.ts
├── product
│   ├── product.controller.ts
│   ├── product.service.ts
│   └── product.module.ts
├── customer
│   ├── customer.controller.ts
│   ├── customer.service.ts
│   └── customer.module.ts
├── inventory
│   ├── inventory.controller.ts
│   ├── inventory.service.ts
│   └── inventory.module.ts
├── stock-management
│   ├── stock-management.controller.ts
│   ├── stock-management.service.ts
│   └── stock-management.module.ts
├── purchase-order
│   ├── purchase-order.controller.ts
│   ├── purchase-order.service.ts
│   └── purchase-order.module.ts
├── purchase-order-item
│   ├── purchase-order-item.controller.ts
│   ├── purchase-order-item.service.ts
│   └── purchase-order-item.module.ts
├── sale
│   ├── sale.controller.ts
│   ├── sale.service.ts
│   └── sale.module.ts
├── sale-item
│   ├── sale-item.controller.ts
│   ├── sale-item.service.ts
│   └── sale-item.module.ts
├── payment
│   ├── payment.controller.ts
│   ├── payment.service.ts
│   └── payment.module.ts
└── audit-log
    ├── audit-log.controller.ts
    ├── audit-log.service.ts
    └── audit-log.module.ts
```

### 1. Prisma Module and Service

Create a dedicated Prisma module and service that other modules can import to use the Prisma client:

**`prisma/prisma.module.ts`**:

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**`prisma/prisma.service.ts`**:

```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 2. App Module

Your root module should import the `PrismaModule` and all the other modules:

**`app.module.ts`**:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { InventoryModule } from './inventory/inventory.module';
import { StockManagementModule } from './stock-management/stock-management.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { PurchaseOrderItemModule } from './purchase-order-item/purchase-order-item.module';
import { SaleModule } from './sale/sale.module';
import { SaleItemModule } from './sale-item/sale-item.module';
import { PaymentModule } from './payment/payment.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    PrismaModule,
    CompanyModule,
    UserModule,
    CategoryModule,
    SupplierModule,
    ProductModule,
    CustomerModule,
    InventoryModule,
    StockManagementModule,
    PurchaseOrderModule,
    PurchaseOrderItemModule,
    SaleModule,
    SaleItemModule,
    PaymentModule,
    AuditLogModule,
  ],
})
export class AppModule {}
```

---

## Example for Each Resource

Below is a pattern you can follow for each entity. We’ll show one fully for **Company**, and then we’ll give short code samples for the others. You can replicate/adjust for the rest of your models.

### **Company**

#### `company.module.ts`

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
```

#### `company.service.ts`

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async createCompany(data: Prisma.CompanyCreateInput): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  async getCompanies(): Promise<Company[]> {
    return this.prisma.company.findMany();
  }

  async getCompanyById(companyId: string): Promise<Company | null> {
    return this.prisma.company.findUnique({
      where: { companyId },
    });
  }

  async updateCompany(companyId: string, data: Prisma.CompanyUpdateInput): Promise<Company> {
    return this.prisma.company.update({
      where: { companyId },
      data,
    });
  }

  async deleteCompany(companyId: string): Promise<Company> {
    return this.prisma.company.delete({
      where: { companyId },
    });
  }
}
```

#### `company.controller.ts`

```ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Prisma } from '@prisma/client';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() data: Prisma.CompanyCreateInput) {
    return this.companyService.createCompany(data);
  }

  @Get()
  findAll() {
    return this.companyService.getCompanies();
  }

  @Get(':companyId')
  findOne(@Param('companyId') companyId: string) {
    return this.companyService.getCompanyById(companyId);
  }

  @Patch(':companyId')
  update(@Param('companyId') companyId: string, @Body() data: Prisma.CompanyUpdateInput) {
    return this.companyService.updateCompany(companyId, data);
  }

  @Delete(':companyId')
  remove(@Param('companyId') companyId: string) {
    return this.companyService.deleteCompany(companyId);
  }
}
```

---

### **User**

**`user.module.ts`**:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

**`user.service.ts`**:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { userId },
    });
  }

  async updateUser(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { userId },
      data,
    });
  }

  async deleteUser(userId: number): Promise<User> {
    return this.prisma.user.delete({
      where: { userId },
    });
  }
}
```

**`user.controller.ts`**:

```ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() data: Prisma.UserCreateInput) {
    return this.userService.createUser(data);
  }

  @Get()
  findAll() {
    return this.userService.getUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.updateUser(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
```

---

### **Category**

```ts
// category.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [PrismaModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}

// category.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async getCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async getCategoryById(categoryId: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { categoryId },
    });
  }

  async updateCategory(categoryId: number, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return this.prisma.category.update({
      where: { categoryId },
      data,
    });
  }

  async deleteCategory(categoryId: number): Promise<Category> {
    return this.prisma.category.delete({
      where: { categoryId },
    });
  }
}

// category.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  create(@Body() data: Prisma.CategoryCreateInput) {
    return this.categoryService.createCategory(data);
  }

  @Get()
  findAll() {
    return this.categoryService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.getCategoryById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.CategoryUpdateInput) {
    return this.categoryService.updateCategory(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.deleteCategory(+id);
  }
}
```

---

### **Supplier**

```ts
// supplier.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';

@Module({
  imports: [PrismaModule],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}

// supplier.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Supplier, Prisma } from '@prisma/client';

@Injectable()
export class SupplierService {
  constructor(private prisma: PrismaService) {}

  async createSupplier(data: Prisma.SupplierCreateInput): Promise<Supplier> {
    return this.prisma.supplier.create({ data });
  }

  async getSuppliers(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany();
  }

  async getSupplierById(supplierId: number): Promise<Supplier | null> {
    return this.prisma.supplier.findUnique({
      where: { supplierId },
    });
  }

  async updateSupplier(supplierId: number, data: Prisma.SupplierUpdateInput): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { supplierId },
      data,
    });
  }

  async deleteSupplier(supplierId: number): Promise<Supplier> {
    return this.prisma.supplier.delete({
      where: { supplierId },
    });
  }
}

// supplier.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Prisma } from '@prisma/client';

@Controller('suppliers')
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Post()
  create(@Body() data: Prisma.SupplierCreateInput) {
    return this.supplierService.createSupplier(data);
  }

  @Get()
  findAll() {
    return this.supplierService.getSuppliers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.getSupplierById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.SupplierUpdateInput) {
    return this.supplierService.updateSupplier(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.deleteSupplier(+id);
  }
}
```

---

### **Product**

```ts
// product.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}

// product.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async getProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async getProductById(productId: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { productId },
      include: {
        category: true,
        supplier: true,
        inventory: true,
      },
    });
  }

  async updateProduct(productId: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { productId },
      data,
    });
  }

  async deleteProduct(productId: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { productId },
    });
  }
}

// product.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  create(@Body() data: Prisma.ProductCreateInput) {
    return this.productService.createProduct(data);
  }

  @Get()
  findAll() {
    return this.productService.getProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.getProductById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ProductUpdateInput) {
    return this.productService.updateProduct(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteProduct(+id);
  }
}
```

---

### **Customer**

```ts
// customer.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Module({
  imports: [PrismaModule],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}

// customer.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Customer, Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  async getCustomers(): Promise<Customer[]> {
    return this.prisma.customer.findMany();
  }

  async getCustomerById(customerId: number): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { customerId },
    });
  }

  async updateCustomer(customerId: number, data: Prisma.CustomerUpdateInput): Promise<Customer> {
    return this.prisma.customer.update({
      where: { customerId },
      data,
    });
  }

  async deleteCustomer(customerId: number): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { customerId },
    });
  }
}

// customer.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Prisma } from '@prisma/client';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  create(@Body() data: Prisma.CustomerCreateInput) {
    return this.customerService.createCustomer(data);
  }

  @Get()
  findAll() {
    return this.customerService.getCustomers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.getCustomerById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.CustomerUpdateInput) {
    return this.customerService.updateCustomer(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.deleteCustomer(+id);
  }
}
```

---

### **Inventory**

```ts
// inventory.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [PrismaModule],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}

// inventory.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inventory, Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async createInventory(data: Prisma.InventoryCreateInput): Promise<Inventory> {
    return this.prisma.inventory.create({ data });
  }

  async getInventories(): Promise<Inventory[]> {
    return this.prisma.inventory.findMany({
      include: {
        product: true,
      },
    });
  }

  async getInventoryById(inventoryId: number): Promise<Inventory | null> {
    return this.prisma.inventory.findUnique({
      where: { inventoryId },
      include: {
        product: true,
      },
    });
  }

  async updateInventory(inventoryId: number, data: Prisma.InventoryUpdateInput): Promise<Inventory> {
    return this.prisma.inventory.update({
      where: { inventoryId },
      data,
    });
  }

  async deleteInventory(inventoryId: number): Promise<Inventory> {
    return this.prisma.inventory.delete({
      where: { inventoryId },
    });
  }
}

// inventory.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Prisma } from '@prisma/client';

@Controller('inventories')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post()
  create(@Body() data: Prisma.InventoryCreateInput) {
    return this.inventoryService.createInventory(data);
  }

  @Get()
  findAll() {
    return this.inventoryService.getInventories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.getInventoryById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.InventoryUpdateInput) {
    return this.inventoryService.updateInventory(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.deleteInventory(+id);
  }
}
```

---

### **Stock Management**

```ts
// stock-management.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StockManagementService } from './stock-management.service';
import { StockManagementController } from './stock-management.controller';

@Module({
  imports: [PrismaModule],
  providers: [StockManagementService],
  controllers: [StockManagementController],
})
export class StockManagementModule {}

// stock-management.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockManagement, Prisma } from '@prisma/client';

@Injectable()
export class StockManagementService {
  constructor(private prisma: PrismaService) {}

  async createStockMovement(data: Prisma.StockManagementCreateInput): Promise<StockManagement> {
    return this.prisma.stockManagement.create({ data });
  }

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
}

// stock-management.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { StockManagementService } from './stock-management.service';
import { Prisma } from '@prisma/client';

@Controller('stock-managements')
export class StockManagementController {
  constructor(private stockManagementService: StockManagementService) {}

  @Post()
  create(@Body() data: Prisma.StockManagementCreateInput) {
    return this.stockManagementService.createStockMovement(data);
  }

  @Get()
  findAll() {
    return this.stockManagementService.getAllStockMovements();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockManagementService.getStockMovementById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.StockManagementUpdateInput) {
    return this.stockManagementService.updateStockMovement(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockManagementService.deleteStockMovement(+id);
  }
}
```

---

### **Purchase Order**

```ts
// purchase-order.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';

@Module({
  imports: [PrismaModule],
  providers: [PurchaseOrderService],
  controllers: [PurchaseOrderController],
})
export class PurchaseOrderModule {}

// purchase-order.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseOrder, Prisma } from '@prisma/client';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) {}

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
}

// purchase-order.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { Prisma } from '@prisma/client';

@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private purchaseOrderService: PurchaseOrderService) {}

  @Post()
  create(@Body() data: Prisma.PurchaseOrderCreateInput) {
    return this.purchaseOrderService.createPurchaseOrder(data);
  }

  @Get()
  findAll() {
    return this.purchaseOrderService.getPurchaseOrders();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.getPurchaseOrderById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.PurchaseOrderUpdateInput) {
    return this.purchaseOrderService.updatePurchaseOrder(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderService.deletePurchaseOrder(+id);
  }
}
```

---

### **Purchase Order Item**

```ts
// purchase-order-item.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PurchaseOrderItemService } from './purchase-order-item.service';
import { PurchaseOrderItemController } from './purchase-order-item.controller';

@Module({
  imports: [PrismaModule],
  providers: [PurchaseOrderItemService],
  controllers: [PurchaseOrderItemController],
})
export class PurchaseOrderItemModule {}

// purchase-order-item.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseOrderItem, Prisma } from '@prisma/client';

@Injectable()
export class PurchaseOrderItemService {
  constructor(private prisma: PrismaService) {}

  async createPurchaseOrderItem(data: Prisma.PurchaseOrderItemCreateInput): Promise<PurchaseOrderItem> {
    return this.prisma.purchaseOrderItem.create({ data });
  }

  async getPurchaseOrderItems(): Promise<PurchaseOrderItem[]> {
    return this.prisma.purchaseOrderItem.findMany({
      include: {
        purchaseOrder: true,
        product: true,
      },
    });
  }

  async getPurchaseOrderItemById(purchaseOrderItemId: number): Promise<PurchaseOrderItem | null> {
    return this.prisma.purchaseOrderItem.findUnique({
      where: { purchaseOrderItemId },
      include: {
        purchaseOrder: true,
        product: true,
      },
    });
  }

  async updatePurchaseOrderItem(purchaseOrderItemId: number, data: Prisma.PurchaseOrderItemUpdateInput): Promise<PurchaseOrderItem> {
    return this.prisma.purchaseOrderItem.update({
      where: { purchaseOrderItemId },
      data,
    });
  }

  async deletePurchaseOrderItem(purchaseOrderItemId: number): Promise<PurchaseOrderItem> {
    return this.prisma.purchaseOrderItem.delete({
      where: { purchaseOrderItemId },
    });
  }
}

// purchase-order-item.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { PurchaseOrderItemService } from './purchase-order-item.service';
import { Prisma } from '@prisma/client';

@Controller('purchase-order-items')
export class PurchaseOrderItemController {
  constructor(private purchaseOrderItemService: PurchaseOrderItemService) {}

  @Post()
  create(@Body() data: Prisma.PurchaseOrderItemCreateInput) {
    return this.purchaseOrderItemService.createPurchaseOrderItem(data);
  }

  @Get()
  findAll() {
    return this.purchaseOrderItemService.getPurchaseOrderItems();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderItemService.getPurchaseOrderItemById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.PurchaseOrderItemUpdateInput) {
    return this.purchaseOrderItemService.updatePurchaseOrderItem(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderItemService.deletePurchaseOrderItem(+id);
  }
}
```

---

### **Sale**

```ts
// sale.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';

@Module({
  imports: [PrismaModule],
  providers: [SaleService],
  controllers: [SaleController],
})
export class SaleModule {}

// sale.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Sale, Prisma } from '@prisma/client';

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

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
}

// sale.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { SaleService } from './sale.service';
import { Prisma } from '@prisma/client';

@Controller('sales')
export class SaleController {
  constructor(private saleService: SaleService) {}

  @Post()
  create(@Body() data: Prisma.SaleCreateInput) {
    return this.saleService.createSale(data);
  }

  @Get()
  findAll() {
    return this.saleService.getSales();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleService.getSaleById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.SaleUpdateInput) {
    return this.saleService.updateSale(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleService.deleteSale(+id);
  }
}
```

---

### **Sale Item**

```ts
// sale-item.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SaleItemService } from './sale-item.service';
import { SaleItemController } from './sale-item.controller';

@Module({
  imports: [PrismaModule],
  providers: [SaleItemService],
  controllers: [SaleItemController],
})
export class SaleItemModule {}

// sale-item.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleItem, Prisma } from '@prisma/client';

@Injectable()
export class SaleItemService {
  constructor(private prisma: PrismaService) {}

  async createSaleItem(data: Prisma.SaleItemCreateInput): Promise<SaleItem> {
    return this.prisma.saleItem.create({ data });
  }

  async getSaleItems(): Promise<SaleItem[]> {
    return this.prisma.saleItem.findMany({
      include: {
        product: true,
        sale: true,
      },
    });
  }

  async getSaleItemById(saleItemId: number): Promise<SaleItem | null> {
    return this.prisma.saleItem.findUnique({
      where: { saleItemId },
      include: {
        product: true,
        sale: true,
      },
    });
  }

  async updateSaleItem(saleItemId: number, data: Prisma.SaleItemUpdateInput): Promise<SaleItem> {
    return this.prisma.saleItem.update({
      where: { saleItemId },
      data,
    });
  }

  async deleteSaleItem(saleItemId: number): Promise<SaleItem> {
    return this.prisma.saleItem.delete({
      where: { saleItemId },
    });
  }
}

// sale-item.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { SaleItemService } from './sale-item.service';
import { Prisma } from '@prisma/client';

@Controller('sale-items')
export class SaleItemController {
  constructor(private saleItemService: SaleItemService) {}

  @Post()
  create(@Body() data: Prisma.SaleItemCreateInput) {
    return this.saleItemService.createSaleItem(data);
  }

  @Get()
  findAll() {
    return this.saleItemService.getSaleItems();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleItemService.getSaleItemById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.SaleItemUpdateInput) {
    return this.saleItemService.updateSaleItem(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleItemService.deleteSaleItem(+id);
  }
}
```

---

### **Payment**

```ts
// payment.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [PrismaModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}

// payment.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment, Prisma } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({ data });
  }

  async getPayments(): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      include: {
        sale: true,
      },
    });
  }

  async getPaymentById(paymentId: number): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { paymentId },
      include: {
        sale: true,
      },
    });
  }

  async updatePayment(paymentId: number, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    return this.prisma.payment.update({
      where: { paymentId },
      data,
    });
  }

  async deletePayment(paymentId: number): Promise<Payment> {
    return this.prisma.payment.delete({
      where: { paymentId },
    });
  }
}

// payment.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Prisma } from '@prisma/client';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  create(@Body() data: Prisma.PaymentCreateInput) {
    return this.paymentService.createPayment(data);
  }

  @Get()
  findAll() {
    return this.paymentService.getPayments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.getPaymentById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.PaymentUpdateInput) {
    return this.paymentService.updatePayment(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.deletePayment(+id);
  }
}
```

---

### **Audit Log**

```ts
// audit-log.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';

@Module({
  imports: [PrismaModule],
  providers: [AuditLogService],
  controllers: [AuditLogController],
})
export class AuditLogModule {}

// audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLog, Prisma } from '@prisma/client';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async createAuditLog(data: Prisma.AuditLogCreateInput): Promise<AuditLog> {
    return this.prisma.auditLog.create({ data });
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      include: {
        changedBy: true,
      },
    });
  }

  async getAuditLogById(auditId: number): Promise<AuditLog | null> {
    return this.prisma.auditLog.findUnique({
      where: { auditId },
      include: {
        changedBy: true,
      },
    });
  }

  async updateAuditLog(auditId: number, data: Prisma.AuditLogUpdateInput): Promise<AuditLog> {
    return this.prisma.auditLog.update({
      where: { auditId },
      data,
    });
  }

  async deleteAuditLog(auditId: number): Promise<AuditLog> {
    return this.prisma.auditLog.delete({
      where: { auditId },
    });
  }
}

// audit-log.controller.ts
import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { Prisma } from '@prisma/client';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  @Post()
  create(@Body() data: Prisma.AuditLogCreateInput) {
    return this.auditLogService.createAuditLog(data);
  }

  @Get()
  findAll() {
    return this.auditLogService.getAuditLogs();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auditLogService.getAuditLogById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.AuditLogUpdateInput) {
    return this.auditLogService.updateAuditLog(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditLogService.deleteAuditLog(+id);
  }
}
```

---


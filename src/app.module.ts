import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/common/guards';
import { CategoriesModule } from './categories/categories.module';
import { CompanyModule } from './company/company.module';
import { CustomersModule } from './customers/customers.module';
import { InventoryModule } from './inventory/inventory.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { PurchaseOrderItemsModule } from './purchase-order-items/purchase-order-items.module';
import { SalesModule } from './sales/sales.module';
import { SaleItemsModule } from './sale-items/sale-items.module';
import { StockManagementModule } from './stock-management/stock-management.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available to all modules
      envFilePath: '.env', // Load environment variables from .env file
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute of time to live
        limit: 10, // 10 requests per TTL
      },
    ]),
    MyLoggerModule,
    UsersModule,
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    CompanyModule,
    CustomersModule,
    InventoryModule,
    PaymentsModule,
    ProductsModule,
    PurchaseOrdersModule,
    PurchaseOrderItemsModule,
    SalesModule,
    SaleItemsModule,
    StockManagementModule,
    SuppliersModule,
    AuditLogModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}

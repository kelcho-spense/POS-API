import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
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
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { AppService } from './app.service';
import { RedisOptions } from './redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available to all modules
      envFilePath: '.env', // Load environment variables from .env file
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute of time to live
        limit: 100, // 10 requests per TTL
      },
    ]),
    CacheModule.registerAsync(RedisOptions),
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
      provide: APP_GUARD, // Register the ThrottlerGuard as a global guard to all controllers
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD, // Register the AtGuard as a global guard to all controllers
      useClass: AtGuard,
    },
    {
      provide: APP_INTERCEPTOR, // Binding the interceptor globally
      useClass: CacheInterceptor, // Use the CacheInterceptor
    },
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule {}

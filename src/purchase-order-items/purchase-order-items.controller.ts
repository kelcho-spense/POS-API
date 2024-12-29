import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from '../purchase-orders/dto/purchase-order.dto';

@Controller('purchase-order-items')
export class PurchaseOrderItemsController {
  constructor(
    private readonly purchaseOrderItemsService: PurchaseOrderItemsService,
  ) {}

  @Post()
  create(@Body() createPurchaseOrderItemDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderItemsService.create(createPurchaseOrderItemDto);
  }

  @Get()
  findAll() {
    return this.purchaseOrderItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderItemDto: UpdatePurchaseOrderDto,
  ) {
    return this.purchaseOrderItemsService.update(
      +id,
      updatePurchaseOrderItemDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderItemsService.remove(+id);
  }
}

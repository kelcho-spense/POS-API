import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import {
  CreatePurchaseOrderItemDto,
  UpdatePurchaseOrderItemDto,
} from './dto/purchase-order-item.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/common/decorators';
import { ExistsViaIdGuard } from 'src/inventory/guards';

@Public()
@ApiBearerAuth()
@Controller('purchase-order-items')
export class PurchaseOrderItemsController {
  constructor(
    private readonly purchaseOrderItemsService: PurchaseOrderItemsService,
  ) {}

  @Post()
  create(
    @Body(ValidationPipe)
    createPurchaseOrderItemData: CreatePurchaseOrderItemDto,
  ) {
    return this.purchaseOrderItemsService.create(createPurchaseOrderItemData);
  }

  @Get()
  findAll() {
    return this.purchaseOrderItemsService.findAll();
  }
  @UseGuards(ExistsViaIdGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseOrderItemsService.findOne(id);
  }

  @UseGuards(ExistsViaIdGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe)
    updatePurchaseOrderItemData: UpdatePurchaseOrderItemDto,
  ) {
    return this.purchaseOrderItemsService.update(
      id,
      updatePurchaseOrderItemData,
    );
  }

  @UseGuards(ExistsViaIdGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseOrderItemsService.remove(id);
  }
}

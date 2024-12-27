import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SaleItemsService } from './sale-items.service';
import { CreateSaleItemDto } from '../sales/dto/sale.dto';
import { UpdateSaleItemDto } from './dto/update-sale-item.dto';

@Controller('sale-items')
export class SaleItemsController {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  @Post()
  create(@Body() createSaleItemDto: CreateSaleItemDto) {
    return this.saleItemsService.create(createSaleItemDto);
  }

  @Get()
  findAll() {
    return this.saleItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleItemDto: UpdateSaleItemDto,
  ) {
    return this.saleItemsService.update(+id, updateSaleItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleItemsService.remove(+id);
  }
}

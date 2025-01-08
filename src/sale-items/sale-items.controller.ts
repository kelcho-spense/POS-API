import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { SaleItemsService } from './sale-items.service';
import { CreateSaleItemDto, UpdateSaleItemDto } from './dto/sale-item.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ExistsViaIdGuard } from './guards/ExistsViaIdGuard';
import { Public } from 'src/auth/common/decorators';

@Public()
@ApiBearerAuth()
@Controller('sale-items')
export class SaleItemsController {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  @Post()
  create(@Body(ValidationPipe) createSaleItemData: CreateSaleItemDto) {
    return this.saleItemsService.create(createSaleItemData);
  }

  @Get()
  findAll() {
    return this.saleItemsService.findAll();
  }

  @UseGuards(ExistsViaIdGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.saleItemsService.findOne(id);
  }

  @UseGuards(ExistsViaIdGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSaleItemData: UpdateSaleItemDto,
  ) {
    return this.saleItemsService.update(id, updateSaleItemData);
  }

  @UseGuards(ExistsViaIdGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.saleItemsService.remove(id);
  }
}

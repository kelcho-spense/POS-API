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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/common/decorators';
import { ExistsViaIdGuard, ReorderLevelGuard } from './guards';

@Public()
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body(ValidationPipe) createInventoryData: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryData);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @UseGuards(ExistsViaIdGuard, ReorderLevelGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  @UseGuards(ExistsViaIdGuard, ReorderLevelGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateInventoryData: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryData);
  }

  @UseGuards(ExistsViaIdGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StockManagementService } from './stock-management.service';
import {
  CreateStockManagementDto,
  UpdateStockManagementDto,
} from './dto/stock-management.dto';

@Controller('stock-management')
export class StockManagementController {
  constructor(
    private readonly stockManagementService: StockManagementService,
  ) {}

  @Post()
  create(@Body() createStockManagementDto: CreateStockManagementDto) {
    return this.stockManagementService.create(createStockManagementDto);
  }

  @Get()
  findAll() {
    return this.stockManagementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockManagementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockManagementDto: UpdateStockManagementDto,
  ) {
    return this.stockManagementService.update(+id, updateStockManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockManagementService.remove(+id);
  }
}

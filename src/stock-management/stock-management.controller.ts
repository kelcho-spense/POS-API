import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StockManagementService } from './stock-management.service';
import {
  CreateStockManagementDto,
  UpdateStockManagementDto,
} from './dto/stock-management.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/auth/common/decorators';
import { ExistsViaIdGuard } from './guards/ExistsViaIdGuard';

@Public()
@ApiBearerAuth()
@Controller('stock-management')
export class StockManagementController {
  constructor(
    private readonly stockManagementService: StockManagementService,
  ) {}

  @Post()
  create(
    @Body(ValidationPipe) createStockManagementDto: CreateStockManagementDto,
  ) {
    return this.stockManagementService.create(createStockManagementDto);
  }

  @Post('with-inventory-update')
  async createWithInventoryUpdate(
    @Body(ValidationPipe) createStockManagementData: CreateStockManagementDto,
  ) {
    return this.stockManagementService.createStockMovementAndUpdateInventory(
      createStockManagementData,
    );
  }

  @Get()
  findAll() {
    return this.stockManagementService.findAll();
  }

  @UseGuards(ExistsViaIdGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stockManagementService.findOne(id);
  }

  @UseGuards(ExistsViaIdGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateStockManagementDto: UpdateStockManagementDto,
  ) {
    return this.stockManagementService.update(id, updateStockManagementDto);
  }

  @UseGuards(ExistsViaIdGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.stockManagementService.remove(id);
  }
}

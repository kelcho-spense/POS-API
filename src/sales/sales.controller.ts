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
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto } from './dto/sale.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/auth/common/decorators';
import { ExistsViaIdGuard } from './guards/ExistsViaIdGuard';
import { Sale } from '@prisma/client';

@Public()
@ApiBearerAuth()
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body(ValidationPipe) createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  findAll(): Promise<Sale[]> {
    return this.salesService.findAll();
  }

  @UseGuards(ExistsViaIdGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Sale> {
    return this.salesService.findOne(id);
  }

  @UseGuards(ExistsViaIdGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateSaleDto: UpdateSaleDto,
  ): Promise<Sale> {
    return this.salesService.update(id, updateSaleDto);
  }

  @UseGuards(ExistsViaIdGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Sale> {
    return this.salesService.remove(id);
  }
}

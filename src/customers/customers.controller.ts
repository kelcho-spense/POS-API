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
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/auth/common/decorators';
import { ExistsViaIdGuard } from './guards/ExistsViaIdGuard';

@Public()
@ApiBearerAuth()
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body(ValidationPipe) createCustomerData: CreateCustomerDto) {
    return this.customersService.create(createCustomerData);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @UseGuards(ExistsViaIdGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @UseGuards(ExistsViaIdGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCustomerData: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerData);
  }

  @UseGuards(ExistsViaIdGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}

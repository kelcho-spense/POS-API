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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/auth/common/decorators';
import { ExistsViaIdGuard } from './guards/ExistsViaIdGuard';

@Public()
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body(ValidationPipe) createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @UseGuards(ExistsViaIdGuard)
  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @UseGuards(ExistsViaIdGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @UseGuards(ExistsViaIdGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }
}

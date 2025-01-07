import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { DatabaseService } from 'src/database/database.service';
import { Payment } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createPaymentData: CreatePaymentDto): Promise<Payment> {
    return await this.databaseService.payment.create({
      data: createPaymentData,
    });
  }

  async findAll(): Promise<Payment[]> {
    return await this.databaseService.payment.findMany();
  }

  async findOne(paymentId: number): Promise<Payment> {
    return await this.databaseService.payment.findUnique({
      where: { paymentId },
    });
  }

  async update(
    paymentId: number,
    updatePaymentData: UpdatePaymentDto,
  ): Promise<Payment> {
    return await this.databaseService.payment.update({
      where: { paymentId },
      data: updatePaymentData,
    });
  }

  async remove(paymentId: number): Promise<Payment> {
    return await this.databaseService.payment.delete({
      where: { paymentId },
    });
  }
}

import { Injectable } from '@nestjs/common';
import {
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from '../purchase-orders/dto/purchase-order.dto';

@Injectable()
export class PurchaseOrderItemsService {
  create(createPurchaseOrderItemDto: CreatePurchaseOrderDto) {
    return 'This action adds a new purchaseOrderItem';
  }

  findAll() {
    return `This action returns all purchaseOrderItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrderItem`;
  }

  update(id: number, updatePurchaseOrderItemDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrderItem`;
  }
}

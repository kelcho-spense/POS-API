import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderItemDto } from '../purchase-orders/dto/purchase-order.dto';
import { UpdatePurchaseOrderItemDto } from './dto/update-purchase-order-item.dto';

@Injectable()
export class PurchaseOrderItemsService {
  create(createPurchaseOrderItemDto: CreatePurchaseOrderItemDto) {
    return 'This action adds a new purchaseOrderItem';
  }

  findAll() {
    return `This action returns all purchaseOrderItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrderItem`;
  }

  update(id: number, updatePurchaseOrderItemDto: UpdatePurchaseOrderItemDto) {
    return `This action updates a #${id} purchaseOrderItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrderItem`;
  }
}

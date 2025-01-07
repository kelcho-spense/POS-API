import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseOrderItemsService } from '../purchase-order-items.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(
    private readonly purchaseOrderItemsService: PurchaseOrderItemsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.purchaseOrderItemsService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`PurchaseOrderItems with ID ${id} not found`);
    }

    return true;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PurchaseOrdersService } from '../purchase-orders.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.purchaseOrdersService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }

    return true;
  }
}

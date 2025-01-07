import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SaleItemsService } from '../sale-items.service';
@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.saleItemsService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`SaleItems with ID ${id} not found`);
    }

    return true;
  }
}

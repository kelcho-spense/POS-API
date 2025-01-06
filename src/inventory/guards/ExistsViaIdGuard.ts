import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryService } from '../inventory.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly inventoryService: InventoryService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.inventoryService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`inventory with ID ${id} not found`);
    }

    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InventoryService } from 'src/inventory/inventory.service';

@Injectable()
export class ReorderLevelGuard implements CanActivate {
  constructor(private readonly inventoryService: InventoryService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const inventoryId = parseInt(request.params.id, 10);

    await this.inventoryService.checkReorderLevel(inventoryId);
    return true;
  }
}

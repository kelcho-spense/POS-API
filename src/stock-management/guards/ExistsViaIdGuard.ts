import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StockManagementService } from '../stock-management.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(
    private readonly stockManagementService: StockManagementService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.stockManagementService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Stock Management with ID ${id} not found`);
    }

    return true;
  }
}

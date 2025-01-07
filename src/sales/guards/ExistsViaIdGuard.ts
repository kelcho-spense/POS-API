import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SalesService } from '../sales.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly salesService: SalesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.salesService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return true;
  }
}

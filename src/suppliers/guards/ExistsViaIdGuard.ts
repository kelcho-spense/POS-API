import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SuppliersService } from '../suppliers.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly suppliersService: SuppliersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.suppliersService.findOne(id);
    if (!entity) {
      throw new NotFoundException(
        `Supplier Management with ID ${id} not found`,
      );
    }

    return true;
  }
}

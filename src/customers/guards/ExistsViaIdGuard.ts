import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomersService } from '../customers.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly customersService: CustomersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.customersService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return true;
  }
}

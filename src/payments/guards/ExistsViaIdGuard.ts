import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from '../payments.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly PaymentsService: PaymentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.PaymentsService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Payments with ID ${id} not found`);
    }

    return true;
  }
}

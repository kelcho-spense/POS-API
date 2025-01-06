import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly productsService: ProductsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.productsService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`products with ID ${id} not found`);
    }

    return true;
  }
}

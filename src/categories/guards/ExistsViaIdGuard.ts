import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from '../categories.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly categoriesService: CategoriesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = parseInt(request.params.id, 10);

    const entity = await this.categoriesService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return true;
  }
}

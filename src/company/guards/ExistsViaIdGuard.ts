import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyService } from '../company.service';

@Injectable()
export class ExistsViaIdGuard implements CanActivate {
  constructor(private readonly companyService: CompanyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;

    const entity = await this.companyService.findOne(id);
    if (!entity) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return true;
  }
}

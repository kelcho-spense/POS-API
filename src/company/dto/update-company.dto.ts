import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}

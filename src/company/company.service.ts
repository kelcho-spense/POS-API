import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CompanyService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCompanyData: CreateCompanyDto) {
    const companyId = uuidv4();
    const newCompany = await this.databaseService.company.create({
      data: {
        companyId,
        ...createCompanyData,
      },
    });
    return newCompany;
  }

  async findOne(companyId?: string, companyName?: string) {
    if (companyId) {
      return await this.databaseService.company.findFirst({
        where: {
          companyId,
        },
      });
    }
    if (companyName) {
      return await this.databaseService.company.findFirst({
        where: {
          companyName,
        },
      });
    }
  }

  async update(companyId: string, updateCompanyData: UpdateCompanyDto) {
    return await this.databaseService.company.update({
      where: {
        companyId,
      },
      data: updateCompanyData,
    });
  }

  async remove(companyId: string) {
    return await this.databaseService.company.delete({
      where: {
        companyId,
      },
    });
  }
}

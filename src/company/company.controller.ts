import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ExistsViaIdGuard } from './guards/ExistsViaIdGuard';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body(ValidationPipe) createCompanyData: CreateCompanyDto) {
    return this.companyService.create(createCompanyData);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(ExistsViaIdGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(ExistsViaIdGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return await this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(ExistsViaIdGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.companyService.remove(id);
  }
}

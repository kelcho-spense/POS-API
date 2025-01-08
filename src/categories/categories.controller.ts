import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ExistsViaIdGuard } from './guards/ExistsViaIdGuard';
import { Public } from 'src/auth/common/decorators';

@Public()
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body(ValidationPipe) createCategoryData: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryData);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(ExistsViaIdGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(ExistsViaIdGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(ExistsViaIdGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}

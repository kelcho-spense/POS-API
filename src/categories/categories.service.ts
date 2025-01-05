import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { DatabaseService } from 'src/database/database.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCategoryData: CreateCategoryDto): Promise<Category> {
    return this.databaseService.category.create({
      data: createCategoryData,
    });
  }

  async findAll(): Promise<Category[]> {
    return this.databaseService.category.findMany();
  }

  async findOne(categoryId: number): Promise<Category> {
    return await this.databaseService.category.findUnique({
      where: { categoryId },
    });
  }

  async update(
    categoryId: number,
    updateCategoryData: UpdateCategoryDto,
  ): Promise<Category> {
    return this.databaseService.category.update({
      where: { categoryId },
      data: updateCategoryData,
    });
  }

  async remove(categoryId: number): Promise<Category> {
    return this.databaseService.category.delete({
      where: { categoryId },
    });
  }
}

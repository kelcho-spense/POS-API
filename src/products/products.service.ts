import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { DatabaseService } from 'src/database/database.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductData: CreateProductDto): Promise<Product> {
    return this.databaseService.product.create({
      data: createProductData,
    });
  }

  async findAll(): Promise<Product[]> {
    return this.databaseService.product.findMany();
  }

  async findOne(productId: number): Promise<Product> {
    return this.databaseService.product.findUnique({
      where: { productId },
    });
  }

  async update(
    productId: number,
    updateProductData: UpdateProductDto,
  ): Promise<Product> {
    return this.databaseService.product.update({
      where: { productId },
      data: updateProductData,
    });
  }

  async remove(productId: number): Promise<Product> {
    return this.databaseService.product.delete({
      where: { productId },
    });
  }
}

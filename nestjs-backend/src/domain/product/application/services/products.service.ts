import { Injectable } from '@nestjs/common';
import { ProductResponseDto } from '../../enterprise/DTOs/product-response.dto';
import { CreateProductDto } from '../../enterprise/DTOs/create-product.dto';
import { UpdateProductDto } from '../../enterprise/DTOs/update-product.dto';
import { ProductServiceContract } from '../contracts/services/product-service-contract';
import { ProductsRepository } from 'src/infrastructure/database/postgres/products-repository';

@Injectable()
export class ProductsService implements ProductServiceContract {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ products: ProductResponseDto[]; total: number }> {
    const { products, total } = await this.productsRepository.findAll(
      page,
      limit,
    );
    return { products, total };
  }

  async findOne(id: number): Promise<ProductResponseDto | null> {
    const product = await this.productsRepository.findOne(id);
    return product ? product : null;
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepository.create(createProductDto);
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto | null> {
    const updatedProduct = await this.productsRepository.update(
      id,
      updateProductDto,
    );
    return updatedProduct ? updatedProduct : null;
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.remove(id);
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await this.productsRepository.bulkDelete(ids);
  }

  async bulkUpdate(ids: number[], availableForSale: boolean): Promise<void> {
    await this.productsRepository.bulkUpdate(ids, availableForSale);
  }
}

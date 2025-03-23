import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsRepositoryContract } from '../../../domain/product/application/contracts/repositories/products-repository-contract';
import { Product } from 'src/domain/product/enterprise/entities/product.entity';
import { CreateProductDto } from 'src/domain/product/enterprise/DTOs/create-product.dto';

@Injectable()
export class ProductsRepository implements ProductsRepositoryContract {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }> {
    const [products, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { products, total };
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await this.productRepository.findOneBy({ id });
    return product ? product : null;
  }

  async create(product: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return await this.productRepository.save(newProduct);
  }

  async update(id: number, product: Partial<Product>): Promise<Product | null> {
    await this.productRepository.update(id, product);
    const updatedProduct = await this.productRepository.findOneBy({ id });
    return updatedProduct ? updatedProduct : null;
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}

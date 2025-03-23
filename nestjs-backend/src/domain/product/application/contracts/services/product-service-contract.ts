import { ProductResponseDto } from '../../../enterprise/DTOs/product-response.dto';
import { CreateProductDto } from '../../../enterprise/DTOs/create-product.dto';
import { UpdateProductDto } from '../../../enterprise/DTOs/update-product.dto';

export abstract class ProductServiceContract {
  abstract findAll(
    page: number,
    limit: number,
  ): Promise<{ products: ProductResponseDto[]; total: number }>;

  abstract findOne(id: number): Promise<ProductResponseDto | null>;

  abstract create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto>;

  abstract update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto | null>;

  abstract remove(id: number): Promise<void>;

  abstract bulkDelete(ids: number[]): Promise<void>;

  abstract bulkUpdate(ids: number[], availableForSale: boolean): Promise<void>;
}

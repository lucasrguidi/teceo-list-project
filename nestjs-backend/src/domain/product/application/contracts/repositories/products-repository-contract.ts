import { Product } from '../../../enterprise/entities/product.entity';

export abstract class ProductsRepositoryContract {
  abstract findAll(
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }>;

  abstract findOne(id: number): Promise<Product | null>;

  abstract create(product: Product): Promise<Product>;

  abstract update(
    id: number,
    product: Partial<Product>,
  ): Promise<Product | null>;

  abstract remove(id: number): Promise<void>;

  abstract bulkDelete(ids: number[]): Promise<void>;

  abstract bulkUpdate(ids: number[], availableForSale: boolean): Promise<void>;
}

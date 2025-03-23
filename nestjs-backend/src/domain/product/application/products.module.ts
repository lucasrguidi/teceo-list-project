import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../enterprise/entities/product.entity';
import { ProductsController } from 'src/controllers/products/products.controller';
import { ProductsService } from './services/products.service';
import { ProductsRepository } from 'src/infrastructure/database/postgres/products-repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}

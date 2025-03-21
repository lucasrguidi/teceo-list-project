import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<{ products: ProductResponseDto[]; total: number }> {
    const { page = 1, limit = 10 } = paginationQuery;
    const products = await this.productsService.findAll(page, limit);
    if (!products)
      throw new InternalServerErrorException('Erro ao buscar produtos');

    return products;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ProductResponseDto | null> {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const newProduct = await this.productsService.create(createProductDto);
    if (!newProduct)
      throw new InternalServerErrorException('Erro ao cadastrar produto');
    return newProduct;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto | null> {
    const product = await this.productsService.findOne(id);
    if (!product) throw new NotFoundException('Produto não encontrado');
    const updatedProduct = await this.productsService.update(
      id,
      updateProductDto,
    );
    if (!updatedProduct)
      throw new InternalServerErrorException('Erro ao atualizar produto');

    return updatedProduct;
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    const result = await this.productsService.remove(id);
    return result;
  }
}

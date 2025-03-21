import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  IsPositive,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  @Length(2, 100, {
    message: 'O nome do produto deve ter entre 2 e 100 caracteres.',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'A categoria do produto deve ser uma string.' })
  @Length(2, 50, {
    message: 'A categoria do produto deve ter entre 2 e 50 caracteres.',
  })
  category?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O estoque deve ser um número.' })
  @IsPositive({ message: 'O estoque deve ser um número positivo.' })
  @Min(0, { message: 'O estoque não pode ser negativo.' })
  @Max(1000, { message: 'O estoque não pode ser maior que 1000.' })
  stock?: number;

  @IsOptional()
  @IsBoolean({ message: 'O campo availableForSale deve ser um booleano.' })
  availableForSale?: boolean;
}

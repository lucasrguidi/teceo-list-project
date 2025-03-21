import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @IsOptional()
  id: number;

  @Column()
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  @Length(2, 100, {
    message: 'O nome do produto deve ter entre 2 e 100 caracteres.',
  })
  name: string;

  @Column()
  @IsString({ message: 'A categoria do produto deve ser uma string.' })
  @IsNotEmpty({ message: 'A categoria do produto é obrigatória.' })
  @Length(2, 50, {
    message: 'A categoria do produto deve ter entre 2 e 50 caracteres.',
  })
  category: string;

  @Column()
  @IsNumber({}, { message: 'O estoque deve ser um número.' })
  @IsPositive({ message: 'O estoque deve ser um número positivo.' })
  @Min(0, { message: 'O estoque não pode ser negativo.' })
  @Max(1000, { message: 'O estoque não pode ser maior que 1000.' })
  stock: number;

  @Column({ default: true })
  @IsBoolean({ message: 'O campo availableForSale deve ser um booleano.' })
  availableForSale: boolean;
}

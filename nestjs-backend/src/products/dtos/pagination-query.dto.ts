import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Page must be greater than or equal to 1.' })
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Limit must be greater than or equal to 1.' })
  @Type(() => Number)
  limit: number = 1;
}

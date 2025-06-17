import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class CategoryFilterDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  sortBy?: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  sortDirection?: 'ASC' | 'DESC';

  @IsString()
  @Type(() => String)
  @IsOptional()
  sortByTitle?: 'ASC' | 'DESC';

  @IsString()
  @Type(() => String)
  @IsOptional()
  sortByCreatedAt?: 'ASC' | 'DESC';
}

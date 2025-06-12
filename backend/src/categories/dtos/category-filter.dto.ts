import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CategoryFilterDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  title?: string;
}

import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

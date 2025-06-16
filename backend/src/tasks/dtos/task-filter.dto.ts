import { Type } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class TaskFilterDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsEnum(['To Do', 'In Progress', 'Done'])
  @IsOptional()
  status?: 'To Do' | 'In Progress' | 'Done';

  @IsDateString()
  @IsOptional()
  fromDate?: Date;

  @IsDateString()
  @IsOptional()
  toDate?: Date;

  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsString()
  @Type(() => String)
  @IsOptional()
  sortByStatus?: 'ASC' | 'DESC';

  @IsString()
  @Type(() => String)
  @IsOptional()
  sortByDueDate?: 'ASC' | 'DESC';
  @IsString()
  @Type(() => String)
  @IsOptional()
  sortByTitle?: 'ASC' | 'DESC';
}

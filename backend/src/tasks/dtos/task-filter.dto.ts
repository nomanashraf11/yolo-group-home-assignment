import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsNumber,
} from 'class-validator';

export class TaskFilterDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
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
}

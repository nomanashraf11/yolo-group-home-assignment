import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsISO8601,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(['To Do', 'In Progress', 'Done'], {
    message: 'Status must be one of: To Do, In Progress, Done',
  })
  status?: 'To Do' | 'In Progress' | 'Done';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;
}

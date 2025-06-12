import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(['To Do', 'In Progress', 'Done'], {
    message: 'Status must be one of: To Do, In Progress, Done',
  })
  status?: 'To Do' | 'In Progress' | 'Done';

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

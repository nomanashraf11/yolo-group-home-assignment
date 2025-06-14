import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

import { Task } from './task.entity';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TaskFilterDto } from './dtos/task-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query() filter: TaskFilterDto,
  ): Promise<{ data: Task[]; count: number }> {
    const [data, count] = await this.tasksService.findAll(filter);
    return { data, count };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Put(':id/category/:categoryId')
  async changeCategory(
    @Param('id') taskId: number,
    @Param('categoryId') categoryId: number,
  ): Promise<Task> {
    return this.tasksService.changeCategory(taskId, categoryId);
  }

  @Get('category/:categoryId')
  async getTasksByCategory(
    @Param('categoryId') categoryId: number,
    @Query() filter: TaskFilterDto,
  ): Promise<{ data: Task[]; count: number }> {
    const [data, count] = await this.tasksService.findByCategory(
      categoryId,
      filter,
    );
    return { data, count };
  }
}

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
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from './dto';
import { Task } from './task.entity';

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

  @Put(':id/remove-category')
  async removeFromCategory(@Param('id') taskId: number): Promise<Task> {
    return this.tasksService.changeCategory(taskId, null);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, FindOperator } from 'typeorm';
import { Task } from './task.entity';
import { TaskFilterDto } from './dtos/task-filter.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(filter: TaskFilterDto): Promise<[Task[], number]> {
    const {
      page = 1,
      limit = 10,
      status,
      fromDate,
      toDate,
      title,
      categoryId,
    } = filter;
    const skip = (page - 1) * limit;

    const where: {
      status?: string;
      title?: FindOperator<string>;
      categoryId?: number;
      dueDate?: FindOperator<Date>;
    } = {};

    if (status) where.status = status;
    if (title) where.title = Like(`%${title}%`);
    if (categoryId) where.categoryId = categoryId;
    if (fromDate && toDate) {
      where.dueDate = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.dueDate = Between(new Date(fromDate), new Date('9999-12-31'));
    } else if (toDate) {
      where.dueDate = Between(new Date('1970-01-01'), new Date(toDate));
    }

    return this.tasksRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { dueDate: 'ASC' },
      relations: ['category'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    return this.tasksRepository.save({ ...task, ...updateTaskDto });
  }

  async remove(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
  async findByCategory(
    categoryId: number,
    filter: TaskFilterDto,
  ): Promise<[Task[], number]> {
    const { page = 1, limit = 10, status } = filter;
    const skip = (page - 1) * limit;

    const where: {
      status?: string;
      categoryId?: number;
    } = { categoryId };

    if (status) where.status = status;

    return this.tasksRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { dueDate: 'ASC' },
    });
  }

  async changeCategory(taskId: number, categoryId: number): Promise<Task> {
    const task = await this.findOne(taskId);
    task.categoryId = categoryId;
    return this.tasksRepository.save(task);
  }
}

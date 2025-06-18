import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      sortByTitle,
      sortByDueDate,
    } = filter;

    const skip = (page - 1) * limit;

    const query = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category');

    if (status) query.andWhere('task.status = :status', { status });
    if (title)
      query.andWhere('task.title ILIKE :title', { title: `%${title}%` });
    if (categoryId)
      query.andWhere('task.categoryId = :categoryId', { categoryId });
    if (fromDate && toDate)
      query.andWhere('task.dueDate BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    else if (fromDate)
      query.andWhere('task.dueDate >= :fromDate', { fromDate });
    else if (toDate) query.andWhere('task.dueDate <= :toDate', { toDate });

    query.skip(skip).take(limit);

    let hasSort = false;

    if (typeof sortByDueDate === 'string') {
      query.orderBy('task.dueDate', sortByDueDate);
      hasSort = true;
    }

    if (typeof sortByTitle === 'string') {
      if (hasSort) {
        query.addOrderBy('task.title', sortByTitle);
      } else {
        query.orderBy('task.title', sortByTitle);
        hasSort = true;
      }
    }

    if (!hasSort) {
      query.orderBy('task.dueDate', 'ASC');
    }

    const [data, count] = await query.getManyAndCount();
    return [data, count];
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
    if ('categoryId' in updateTaskDto) {
      await this.tasksRepository.query(
        'UPDATE task SET "categoryId" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2',
        [updateTaskDto.categoryId, id],
      );
      delete updateTaskDto.categoryId;
      if ('category' in updateTaskDto) delete updateTaskDto.category;
    }

    if (Object.keys(updateTaskDto).length > 0) {
      const task = await this.findOne(id);
      return this.tasksRepository.save({ ...task, ...updateTaskDto });
    } else {
      return this.findOne(id);
    }
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

  async changeCategory(
    taskId: string | number,
    categoryId: string | number,
  ): Promise<Task | null> {
    try {
      console.log(taskId, categoryId);
      const taskIdNum =
        typeof taskId === 'string' ? parseInt(taskId, 10) : taskId;
      const categoryIdNum =
        typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;

      await this.tasksRepository.query(
        'UPDATE task SET "categoryId" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2',
        [categoryIdNum, taskIdNum],
      );

      const updatedTask = await this.tasksRepository.findOne({
        where: { id: taskIdNum },
        relations: ['category'],
      });

      return updatedTask;
    } catch (error) {
      console.error('Error changing task category:', error);
      throw error;
    }
  }
}

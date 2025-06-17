import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryFilterDto } from './dtos/category-filter.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(filter: CategoryFilterDto): Promise<[Category[], number]> {
    const {
      page = 1,
      limit = 10,
      title,
      sortBy,
      sortDirection,
      sortByTitle,
      sortByCreatedAt,
    } = filter;

    const skip = (page - 1) * limit;

    const query = this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.tasks', 'tasks');

    if (title) {
      query.andWhere('category.title ILIKE :title', { title: `%${title}%` });
    }

    query.skip(skip).take(limit);

    let hasSort = false;

    // Handle sortBy and sortDirection from frontend
    if (sortBy && sortDirection) {
      if (sortBy === 'title') {
        query.orderBy('category.title', sortDirection);
        hasSort = true;
      } else if (sortBy === 'createdAt') {
        query.orderBy('category.createdAt', sortDirection);
        hasSort = true;
      }
    }

    // Handle legacy sorting parameters
    if (typeof sortByCreatedAt === 'string') {
      query.orderBy('category.createdAt', sortByCreatedAt);
      hasSort = true;
    }

    if (typeof sortByTitle === 'string') {
      if (hasSort) {
        query.addOrderBy('category.title', sortByTitle);
      } else {
        query.orderBy('category.title', sortByTitle);
        hasSort = true;
      }
    }

    if (!hasSort) {
      query.orderBy('category.title', 'ASC');
    }

    const [data, count] = await query.getManyAndCount();
    return [data, count];
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    return this.categoriesRepository.save({
      ...category,
      ...updateCategoryDto,
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}

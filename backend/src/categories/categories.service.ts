import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
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
    const { page = 1, limit = 10, title } = filter;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Category> = {};
    if (title) where.title = Like(`%${title}%`);

    return this.categoriesRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { title: 'ASC' },
      relations: ['tasks'],
    });
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

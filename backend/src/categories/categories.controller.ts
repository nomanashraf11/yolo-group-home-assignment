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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryFilterDto } from './dto';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @Query() filter: CategoryFilterDto,
  ): Promise<{ data: Category[]; count: number }> {
    const [data, count] = await this.categoriesService.findAll(filter);
    return { data, count };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}

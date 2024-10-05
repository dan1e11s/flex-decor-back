import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return this.categoryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCategory(@Body('name') name: string) {
    return this.categoryService.create(name);
  }
}

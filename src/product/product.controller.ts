import {
  Controller,
  Get,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getAllProducts() {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
          callback(null, uniqueSuffix);
        },
      }),
    }),
  )
  async uploadProduct(
    @UploadedFile() file: any,
    @Body() body: { category: string },
  ) {
    const category = await this.categoryService.findAll();
    const categoryExists = category.some((cat) => cat.name === body.category);

    if (!categoryExists) {
      throw new BadRequestException('Category does not exist');
    }

    const apiUrl = this.configService.get<string>('API_URL');
    const imageUrl = `${apiUrl}/uploads/${file.filename}`;
    return this.productService.create(body.category, imageUrl);
  }
}

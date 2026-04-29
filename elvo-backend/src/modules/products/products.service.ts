import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private redis: Redis;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.redis = new Redis(this.config.get('REDIS_URL'));
  }

  async findAll(filters: ProductFilterDto) {
    const cacheKey = `products:${JSON.stringify(filters)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const { page = 1, limit = 20, search, categorySlug } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (categorySlug) where.category = { slug: categorySlug };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true, variants: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const result = { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true, variants: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        categoryId: dto.categoryId,
        images: dto.images,
        isActive: dto.isActive ?? true,
        variants: { create: dto.variants },
      },
      include: { variants: true },
    });
    await this.redis.flushdb();
    return product;
  }

  async delete(id: string) {
    await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    await this.redis.flushdb();
    return { message: 'Product deactivated' };
  }
}

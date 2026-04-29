import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findOrCreate(name: string, slug: string) {
    return this.prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

  create(name: string, slug: string) {
    return this.prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }
}

import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: dto.items.map(i => i.variantId) } },
    });

    if (variants.length !== dto.items.length) {
      throw new NotFoundException('One or more variants not found');
    }

    for (const item of dto.items) {
      const variant = variants.find(v => v.id === item.variantId);
      if (!variant) throw new NotFoundException(`Variant ${item.variantId} not found`);
      if (variant.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for SKU: ${variant.sku}`);
      }
    }

    const totalInCents = dto.items.reduce((sum, item) => {
      const variant = variants.find(v => v.id === item.variantId);
      if (!variant) return sum;
      return sum + variant.priceInCents * item.quantity;
    }, 0);

    const order = await this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          userId,
          addressId: dto.addressId,
          totalInCents,
          items: {
            create: dto.items.map(item => {
              const variant = variants.find(v => v.id === item.variantId)!;
              return {
                variantId: item.variantId,
                quantity: item.quantity,
                unitPriceInCents: variant.priceInCents,
              };
            }),
          },
        },
        include: { items: true },
      });
    });

    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        payment: true,
        address: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { user: { select: { email: true, firstName: true } }, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
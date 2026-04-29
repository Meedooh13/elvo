import {
  Controller, Post, Body, Req, HttpCode, ForbiddenException, InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhookController {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

  @Post('paymob')
  @HttpCode(200)
  async handlePaymob(@Body() body: any, @Req() req: Request) {
    const hmacSecret = this.config.get<string>('PAYMOB_HMAC_SECRET');

    if (!hmacSecret) {
      throw new InternalServerErrorException('HMAC secret not configured');
    }

    const receivedHmac = body.hmac;
    const obj = body.obj;

    const concatenated = [
      obj.amount_cents, obj.created_at, obj.currency,
      obj.error_occured, obj.has_parent_transaction, obj.id,
      obj.integration_id, obj.is_3d_secure, obj.is_auth,
      obj.is_capture, obj.is_refunded, obj.is_standalone_payment,
      obj.is_voided, obj.order?.id, obj.owner, obj.pending,
      obj.source_data?.pan, obj.source_data?.sub_type, obj.source_data?.type,
      obj.success,
    ].join('');

    const expectedHmac = crypto
        .createHmac('sha512', hmacSecret)
        .update(concatenated)
        .digest('hex');

    if (receivedHmac !== expectedHmac) {
      throw new ForbiddenException('Invalid HMAC — rejecting webhook');
    }

    const paymobOrderId = String(obj.order?.id);
    const isSuccess = obj.success === true || obj.success === 'true';

    const order = await this.prisma.order.findUnique({ where: { paymobOrderId } });
    if (!order) return { received: true };

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: order.id },
        data: { status: isSuccess ? 'PAID' : 'CANCELLED' },
      }),
      this.prisma.payment.upsert({
        where: { orderId: order.id },
        update: {
          status: isSuccess ? 'SUCCESS' : 'FAILED',
          paymobTransactionId: String(obj.id),
          rawWebhookPayload: body,
        },
        create: {
          orderId: order.id,
          status: isSuccess ? 'SUCCESS' : 'FAILED',
          amountInCents: obj.amount_cents,
          paymobTransactionId: String(obj.id),
          rawWebhookPayload: body,
        },
      }),
    ]);

    return { received: true };
  }
}
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly baseUrl = 'https://accept.paymob.com/api';

  constructor(private config: ConfigService, private prisma: PrismaService) {}

  private async getAuthToken(): Promise<string> {
    const { data } = await axios.post(`${this.baseUrl}/auth/tokens`, {
      api_key: this.config.get('PAYMOB_API_KEY'),
    });
    return data.token;
  }

  private async registerOrder(
    authToken: string,
    amountCents: number,
    items: { name: string; amount_cents: number; quantity: number }[],
  ): Promise<number> {
    const { data } = await axios.post(`${this.baseUrl}/ecommerce/orders`, {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: 'EGP',
      items,
    });
    return data.id;
  }

  private async getPaymentKey(
    authToken: string,
    paymobOrderId: number,
    amountCents: number,
    billingData: Record<string, string>,
  ): Promise<string> {
    const { data } = await axios.post(`${this.baseUrl}/acceptance/payment_keys`, {
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: billingData,
      currency: 'EGP',
      integration_id: Number(this.config.get('PAYMOB_INTEGRATION_ID')),
    });
    return data.token;
  }

  async initiateCheckout(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        user: true,
        address: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    try {
      const authToken = await this.getAuthToken();

      const items = order.items.map(i => ({
        name: i.variant.product.name,
        amount_cents: i.unitPriceInCents,
        quantity: i.quantity,
      }));

      const paymobOrderId = await this.registerOrder(authToken, order.totalInCents, items);

      await this.prisma.order.update({
        where: { id: orderId },
        data: { paymobOrderId: String(paymobOrderId), status: 'AWAITING_PAYMENT' },
      });

      const billingData = {
        apartment: 'NA', email: order.user.email,
        floor: 'NA', first_name: order.user.firstName,
        street: order.address.street, building: 'NA',
        phone_number: order.user.phone ?? 'NA',
        shipping_method: 'PKG', postal_code: order.address.postalCode,
        city: order.address.city, country: order.address.country,
        last_name: order.user.lastName, state: order.address.city,
      };

      const paymentKey = await this.getPaymentKey(
        authToken, paymobOrderId, order.totalInCents, billingData,
      );

      const iframeId = this.config.get('PAYMOB_IFRAME_ID');
      return {
        paymentKey,
        iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`,
      };
    } catch (err) {
      throw new InternalServerErrorException('Payment initiation failed: ' + err.message);
    }
  }
}

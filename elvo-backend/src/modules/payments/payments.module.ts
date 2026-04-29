import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentsController } from './payments.controller';
import { WebhookController } from './webhook.controller';

@Module({
  providers: [PaymentService],
  controllers: [PaymentsController, WebhookController],
})
export class PaymentsModule {}

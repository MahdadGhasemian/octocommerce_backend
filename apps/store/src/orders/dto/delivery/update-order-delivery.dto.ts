import { PartialType } from '@nestjs/swagger';
import { CreateOrderDeliveryDto } from './create-order-delivery.dto';

export class UpdateOrderDeliveryDto extends PartialType(
  CreateOrderDeliveryDto,
) {}

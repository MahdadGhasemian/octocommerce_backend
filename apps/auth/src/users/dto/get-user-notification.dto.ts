import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetUserNotificationAccessDto {
  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  notification_order_created?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  notification_payment_created?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  notification_delivery_created?: boolean;
}

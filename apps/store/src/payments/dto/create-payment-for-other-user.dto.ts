import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';

export class CreatePaymentForOtherUserDto extends CreatePaymentDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  user_id: number;
}

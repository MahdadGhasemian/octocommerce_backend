import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class CreateOrderForOtherUserDto extends CreateOrderDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  user_id: number;
}

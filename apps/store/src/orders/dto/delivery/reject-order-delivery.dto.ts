import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RejectOrderDeliveryDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  rejected_note: string;
}

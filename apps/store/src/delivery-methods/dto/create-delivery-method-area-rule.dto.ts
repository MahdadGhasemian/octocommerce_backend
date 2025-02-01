import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateDeliveryMethodAreaRuleDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  area_name: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 10000,
  })
  @IsNumber()
  price: number;
}

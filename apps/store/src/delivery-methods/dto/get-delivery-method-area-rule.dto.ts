import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GetDeliveryMethodAreaRuleDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 10000,
  })
  @IsString()
  @Expose()
  area_name: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 10000,
  })
  @IsNumber()
  @Expose()
  price: number;
}

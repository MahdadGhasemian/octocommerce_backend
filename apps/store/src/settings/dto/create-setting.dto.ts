import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({
    example: '1402',
    required: true,
  })
  @IsNumber()
  invoice_number_pre_part: number;

  @ApiProperty({
    example: '100000',
    required: true,
  })
  @IsNumber()
  invoice_number_multiple: number;

  @ApiProperty({
    example: '10',
    required: true,
  })
  @IsNumber()
  tax_rate_default: number;

  @ApiProperty({
    example: '10000',
    required: true,
  })
  @IsNumber()
  base_price_scale_amount?: number;

  @ApiProperty({
    example: '35.7172',
    required: true,
  })
  @IsNumber()
  delivery_center_latitude: number;

  @ApiProperty({
    example: '51.3995',
    required: true,
  })
  @IsNumber()
  delivery_center_longitude: number;

  @ApiProperty({
    type: String,
    example: 'p-',
    required: false,
  })
  @IsString()
  @IsOptional()
  product_code_prefix: string;
}

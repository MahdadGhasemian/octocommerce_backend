import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetSettingDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: '1402',
    required: true,
  })
  @IsNumber()
  @Expose()
  invoice_number_pre_part?: number;

  @ApiProperty({
    example: '100000',
    required: true,
  })
  @IsNumber()
  @Expose()
  invoice_number_multiple?: number;

  @ApiProperty({
    example: '10',
    required: true,
  })
  @IsNumber()
  @Expose()
  tax_rate_default?: number;

  @ApiProperty({
    example: '35.7172',
    required: true,
  })
  @IsNumber()
  @Expose()
  delivery_center_latitude?: number;

  @ApiProperty({
    example: '51.3995',
    required: true,
  })
  @IsNumber()
  @Expose()
  delivery_center_longitude?: number;
}

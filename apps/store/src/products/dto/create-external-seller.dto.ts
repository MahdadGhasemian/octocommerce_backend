import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateExternalSellerDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  store_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  store_product_url: string;
}

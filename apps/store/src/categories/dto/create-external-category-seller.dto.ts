import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateExternalCategorySellerDto {
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
  store_category_url: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  store_category_english_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  store_category_persian_name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetExternalCategorySellerDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  store_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  store_category_url: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  store_category_english_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  store_category_persian_name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GetReviewGistQueryDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  product_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  product_code?: string;
}

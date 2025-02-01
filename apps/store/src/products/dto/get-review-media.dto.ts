import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GetReviewMediaDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @Expose()
  url: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateReviewMediaDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  url: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
}

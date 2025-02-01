import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Number,
    example: [1, 2],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  user_ids: number[];
}

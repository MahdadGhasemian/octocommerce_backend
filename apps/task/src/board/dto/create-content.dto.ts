import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  content_follow: string;
}

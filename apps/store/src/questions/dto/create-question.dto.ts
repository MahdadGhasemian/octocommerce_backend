import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    example: 'Question ?',
    required: true,
  })
  @IsString()
  question_text: string;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  product_id: number;
}

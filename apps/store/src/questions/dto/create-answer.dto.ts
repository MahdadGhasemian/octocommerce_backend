import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    example: 'Because of ?',
    required: true,
  })
  @IsString()
  answer_text: string;
}

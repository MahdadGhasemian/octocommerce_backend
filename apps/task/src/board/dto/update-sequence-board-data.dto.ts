import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateSequenceBoardDataDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  board_id: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  group_id: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  board_sequence_number: number;
}

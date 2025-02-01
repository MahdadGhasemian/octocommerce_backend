import { ApiProperty } from '@nestjs/swagger';
import { UpdateSequenceBoardDataDto } from './update-sequence-board-data.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateSequenceBoardDto {
  @ApiProperty({
    type: UpdateSequenceBoardDataDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSequenceBoardDataDto)
  @Expose()
  data?: UpdateSequenceBoardDataDto[];
}

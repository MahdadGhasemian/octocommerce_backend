import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetBoardDto } from './get-board.dto';

export class ListBoardDto extends ListDto<GetBoardDto> {
  @IsArray()
  @Type(() => GetBoardDto)
  @Expose()
  data: GetBoardDto[];
}

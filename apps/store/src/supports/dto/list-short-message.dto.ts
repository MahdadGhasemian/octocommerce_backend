import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetShortMessageDto } from './get-short-message.dto';

export class ListShortMessageDto extends ListDto<GetShortMessageDto> {
  @IsArray()
  @Type(() => GetShortMessageDto)
  @Expose()
  data: GetShortMessageDto[];
}

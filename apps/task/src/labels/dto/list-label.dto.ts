import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetLabelDto } from './get-label.dto';

export class ListLabelDto extends ListDto<GetLabelDto> {
  @IsArray()
  @Type(() => GetLabelDto)
  @Expose()
  data: GetLabelDto[];
}

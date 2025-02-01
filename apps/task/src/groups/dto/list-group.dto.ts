import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetGroupDto } from './get-group.dto';

export class ListGroupDto extends ListDto<GetGroupDto> {
  @IsArray()
  @Type(() => GetGroupDto)
  @Expose()
  data: GetGroupDto[];
}

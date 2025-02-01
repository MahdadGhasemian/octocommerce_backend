import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetInventoryItemDto } from './get-inventory-item.dto';

export class ListInventoryItemDto extends ListDto<GetInventoryItemDto> {
  @IsArray()
  @Type(() => GetInventoryItemDto)
  @Expose()
  data: GetInventoryItemDto[];
}

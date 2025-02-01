import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetInventoryDto } from './get-inventory.dto';

export class ListInventoryDto extends ListDto<GetInventoryDto> {
  @IsArray()
  @Type(() => GetInventoryDto)
  @Expose()
  data: GetInventoryDto[];
}

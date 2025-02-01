import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetWarehouseDto } from './get-warehouse.dto';

export class ListWarehouseDto extends ListDto<GetWarehouseDto> {
  @IsArray()
  @Type(() => GetWarehouseDto)
  @Expose()
  data: GetWarehouseDto[];
}

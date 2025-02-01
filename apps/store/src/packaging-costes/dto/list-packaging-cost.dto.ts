import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetPackagingCostDto } from './get-packaging-cost.dto';

export class ListPackagingCostDto extends ListDto<GetPackagingCostDto> {
  @IsArray()
  @Type(() => GetPackagingCostDto)
  @Expose()
  data: GetPackagingCostDto[];
}

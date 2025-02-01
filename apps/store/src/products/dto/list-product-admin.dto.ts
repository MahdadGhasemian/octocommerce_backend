import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetProductAdminDto } from './get-product-admin.dto';

export class ListProductAdminDto extends ListDto<GetProductAdminDto> {
  @IsArray()
  @Type(() => GetProductAdminDto)
  @Expose()
  data: GetProductAdminDto[];
}

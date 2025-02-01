import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetCategoryAdminDto } from './get-category-admin.dto';

export class ListCategoryAdminDto extends ListDto<GetCategoryAdminDto> {
  @IsArray()
  @Type(() => GetCategoryAdminDto)
  @Expose()
  data: GetCategoryAdminDto[];
}

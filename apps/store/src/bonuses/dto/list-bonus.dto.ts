import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetBonusDto } from './get-bonus.dto';

export class ListBonusDto extends ListDto<GetBonusDto> {
  @IsArray()
  @Type(() => GetBonusDto)
  @Expose()
  data: GetBonusDto[];
}

import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetDeliveryMethodDto } from './get-delivery-method.dto';

export class ListDeliveryMethodDto extends ListDto<GetDeliveryMethodDto> {
  @IsArray()
  @Type(() => GetDeliveryMethodDto)
  @Expose()
  data: GetDeliveryMethodDto[];
}

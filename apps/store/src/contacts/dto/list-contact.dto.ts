import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetContactDto } from './get-contact.dto';

export class ListContactDto extends ListDto<GetContactDto> {
  @IsArray()
  @Type(() => GetContactDto)
  @Expose()
  data: GetContactDto[];
}

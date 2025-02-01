import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetProjectDto } from './get-project.dto';

export class ListProjectDto extends ListDto<GetProjectDto> {
  @IsArray()
  @Type(() => GetProjectDto)
  @Expose()
  data: GetProjectDto[];
}

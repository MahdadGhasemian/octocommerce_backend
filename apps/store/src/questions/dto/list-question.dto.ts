import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetQuestionDto } from './get-question.dto';

export class ListQuestionDto extends ListDto<GetQuestionDto> {
  @IsArray()
  @Type(() => GetQuestionDto)
  @Expose()
  data: GetQuestionDto[];
}

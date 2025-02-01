import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetReviewDto } from './get-review.dto';

export class ListReviewDto extends ListDto<GetReviewDto> {
  @IsArray()
  @Type(() => GetReviewDto)
  @Expose()
  data: GetReviewDto[];
}

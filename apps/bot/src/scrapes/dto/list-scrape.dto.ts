import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetScrapeDto } from './get-scrape.dto';

export class ListScrapeDto extends ListDto<GetScrapeDto> {
  @IsArray()
  @Type(() => GetScrapeDto)
  @Expose()
  data: GetScrapeDto[];
}

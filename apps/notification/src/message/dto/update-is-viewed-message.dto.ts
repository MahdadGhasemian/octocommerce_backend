import { IsBoolean } from 'class-validator';

export class UpdateIsViewedMessageDto {
  @IsBoolean()
  is_viewed: boolean;
}

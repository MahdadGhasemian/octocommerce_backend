import { IsNumber } from 'class-validator';
import { UpdateIsViewedMessageDto } from './update-is-viewed-message.dto';

export class UpdateMessageDto extends UpdateIsViewedMessageDto {
  @IsNumber()
  id: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

export class CreateContactForOtherUserDto extends CreateContactDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  user_id: number;
}

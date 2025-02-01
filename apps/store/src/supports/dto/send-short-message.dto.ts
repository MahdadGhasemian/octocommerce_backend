import { IranMobilePhoneValidation, SmsTitleType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';

export class SendShortMessageDto {
  @ApiProperty({
    example: '+989129632744',
    required: true,
  })
  @IsString()
  @Validate(IranMobilePhoneValidation)
  mobile_phone: string;

  @ApiProperty({
    enum: SmsTitleType,
    required: true,
  })
  @IsEnum(SmsTitleType)
  title_type: SmsTitleType;

  @ApiProperty({
    type: String,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  text_list?: string[];
}

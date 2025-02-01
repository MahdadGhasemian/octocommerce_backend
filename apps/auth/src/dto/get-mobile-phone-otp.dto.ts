import { IranMobilePhoneValidation } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Validate } from 'class-validator';

export class GetMobilePhoneOtpDto {
  @ApiProperty({
    example: '+989129632744',
    required: true,
  })
  @IsString()
  @Validate(IranMobilePhoneValidation)
  mobile_phone: string;
}

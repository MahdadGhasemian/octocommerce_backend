import { IranMobilePhoneValidation } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Validate } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+989129632744',
    required: true,
  })
  @IsString()
  @Validate(IranMobilePhoneValidation)
  mobile_phone: string;

  @ApiProperty({
    example: 'YP<7(SHO@&s/Zf:;&8@Zh;!wsjNMAx6Y',
    required: true,
  })
  @IsOptional()
  password: string;
}

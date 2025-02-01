import { IranMobilePhoneValidation } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';

export class ConfirmMobilePhoneOtpDto {
  @ApiProperty({
    example: '+989129632744',
    required: true,
  })
  @IsString()
  @Validate(IranMobilePhoneValidation)
  mobile_phone: string;

  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: false,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: 'Mahdad',
    required: false,
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    example: 'Ghasemian',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    type: String,
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    example: 'YP<7(SHO@&s/Zf:;&8@Zh;!wsjNMAx6Y',
    required: false,
  })
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: '92478',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  confirmation_code: number;

  @ApiProperty({
    example: 'a-long-token',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  hashed_code: string;
}

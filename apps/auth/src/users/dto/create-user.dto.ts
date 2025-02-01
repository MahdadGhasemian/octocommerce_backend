import { IranMobilePhoneValidation } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '+989129632744',
    required: true,
  })
  @IsString()
  @Validate(IranMobilePhoneValidation)
  mobile_phone: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  mobile_phone_is_verified?: boolean;

  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: false,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  email_is_verified?: boolean;

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
    example: 'http://localhost/image1000.jpg',
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
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  created_by_system?: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  need_to_set_name?: boolean;

  @ApiProperty({
    type: Number,
    example: [1, 2],
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  access_ids: number[];
}

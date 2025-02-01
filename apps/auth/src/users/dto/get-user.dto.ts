import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { GetAccessDto } from '../../accesses/dto/get-access.dto';
import { IranMobilePhoneValidation } from '@app/common';

export class GetUserDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: '+989129632744',
    required: true,
  })
  @IsString()
  @Validate(IranMobilePhoneValidation)
  @Expose()
  mobile_phone?: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @Expose()
  mobile_phone_is_verified?: boolean;

  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: false,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  email?: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @Expose()
  email_is_verified?: boolean;

  @ApiProperty({
    example: 'Mahdad',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  first_name?: string;

  @ApiProperty({
    example: 'Ghasemian',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  last_name?: string;

  @ApiProperty({
    type: String,
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  avatar?: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @Expose()
  created_by_system?: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @Expose()
  need_to_set_name?: boolean;

  @ApiProperty({
    type: GetAccessDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => GetAccessDto)
  @Expose()
  accesses?: GetAccessDto[];
}

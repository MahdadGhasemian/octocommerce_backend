import { ContactType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class GetContactDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    enum: ContactType,
    default: ContactType.INDIVIDUAL,
    required: true,
  })
  @IsEnum(ContactType)
  @Expose()
  contact_type?: ContactType;

  @ApiProperty({
    example: 'Mahdad Info',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiProperty({
    example: 'Mahdad Ghasemian',
    required: true,
  })
  @IsString()
  @Expose()
  name?: string;

  @ApiProperty({
    example: '021-12345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  @Expose()
  phone?: string;

  @ApiProperty({
    example: '+989129632744',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsMobilePhone()
  @Expose()
  mobile_phone?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  address?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  city?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  postal_code?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  national_code?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  economic_code?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  latitude?: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  longitude?: number;
}

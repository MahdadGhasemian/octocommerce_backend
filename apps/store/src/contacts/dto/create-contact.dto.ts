import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: 'Mahdad Info',
    required: false,
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'Mahdad Ghasemian',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '021-12345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '+989129632744',
    required: false,
  })
  @IsString()
  @IsOptional()
  mobile_phone?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  national_code?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  economic_code?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

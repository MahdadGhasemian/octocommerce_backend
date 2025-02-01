import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  @Expose()
  mobile_phone: string;

  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: false,
  })
  @IsOptional()
  @Expose()
  email?: string;

  @ApiProperty({
    example: 'Mahdad',
    required: false,
  })
  @IsOptional()
  @Expose()
  first_name?: string;

  @ApiProperty({
    example: 'Ghasemian',
    required: false,
  })
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
}

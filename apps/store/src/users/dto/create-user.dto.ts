import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '+989129632744',
    required: true,
  })
  @IsOptional()
  mobile_phone: string;

  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: false,
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'Mahdad',
    required: false,
  })
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    example: 'Ghasemian',
    required: false,
  })
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsOptional()
  need_to_set_name?: boolean;

  @ApiProperty({
    type: String,
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}

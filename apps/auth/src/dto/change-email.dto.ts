import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({
    example: 'mahdad.ghasemian@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

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

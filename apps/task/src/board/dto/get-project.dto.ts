import { GetUserDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProjectDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Expose()
  title?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    type: GetUserDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @Type(() => GetUserDto)
  @Expose()
  users?: GetUserDto[];

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  owned_by?: GetUserDto;
}

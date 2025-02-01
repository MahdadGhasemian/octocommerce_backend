import { AbstractGetDto, GetUserDto, SmsTitleType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetShortMessageDto extends AbstractGetDto {
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
  @Expose()
  mobile_phone?: string;

  @ApiProperty({
    enum: SmsTitleType,
    required: true,
  })
  @IsEnum(SmsTitleType)
  @Expose()
  title_type?: SmsTitleType;

  @ApiProperty({
    type: String,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @Expose()
  text_list?: string[];

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @Expose()
  is_sent_by_system?: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  user_id?: number;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  user?: GetUserDto;
}

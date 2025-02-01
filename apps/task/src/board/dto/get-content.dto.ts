import { AbstractGetDto, ContentType, GetUserDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { GetGroupDto } from './get-group.dto';

export class GetContentDto extends AbstractGetDto {
  @ApiProperty({
    enum: ContentType,
    default: ContentType.USER_COMMENT,
    required: true,
  })
  @IsEnum(ContentType)
  @Expose()
  content_type?: ContentType;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  content?: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  content_follow?: string;

  @ApiProperty({
    type: GetGroupDto,
    required: false,
  })
  @Type(() => GetGroupDto)
  @Expose()
  group?: GetGroupDto;

  @ApiProperty({
    type: GetUserDto,
    required: false,
  })
  @Type(() => GetUserDto)
  @Expose()
  user?: GetUserDto;
}

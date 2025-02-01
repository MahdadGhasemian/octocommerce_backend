import { AbstractGetDto, CommentType, GetUserDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { GetContentDto } from './get-content.dto';

export class GetCommentDto extends AbstractGetDto {
  @ApiProperty({
    enum: CommentType,
    default: CommentType.COMMENT,
    required: true,
  })
  @IsEnum(CommentType)
  @Expose()
  comment_type?: CommentType;

  @ApiProperty({
    type: GetContentDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @Type(() => GetContentDto)
  @Expose()
  content?: GetContentDto[];

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  created_by_user_id?: number;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  created_by?: GetUserDto;
}

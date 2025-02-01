import { AbstractGetDto, GetUserDto, TaskPriority } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetProjectDto } from './get-project.dto';
import { GetGroupDto } from './get-group.dto';
import { GetCommentDto } from './get-comment.dto';

export class GetBoardDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    enum: TaskPriority,
    default: TaskPriority.LOW,
    required: true,
  })
  @IsEnum(TaskPriority)
  @Expose()
  priority?: TaskPriority;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  title?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  board_sequence_number?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  project_id?: number;

  @ApiProperty({
    type: GetProjectDto,
    required: true,
  })
  @Type(() => GetProjectDto)
  @Expose()
  project?: GetProjectDto;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  group_id?: number;

  @ApiProperty({
    type: GetGroupDto,
    required: true,
  })
  @Type(() => GetGroupDto)
  @Expose()
  group?: GetGroupDto;

  @ApiProperty({
    type: GetCommentDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @Type(() => GetCommentDto)
  @Expose()
  comments?: GetCommentDto[];

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

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  assigned_to_user_id?: number;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  assigned_to?: GetUserDto;

  @ApiProperty({
    type: GetUserDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @Type(() => GetUserDto)
  @Expose()
  flow_users?: GetUserDto[];
}

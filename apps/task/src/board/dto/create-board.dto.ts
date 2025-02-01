import { TaskPriority } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    enum: TaskPriority,
    default: TaskPriority.LOW,
    required: true,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  board_sequence_number: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  project_id: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  group_id: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  assigned_to_user_id: number;
}

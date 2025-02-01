import { AbstractGetDto, GetUserDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAnswerDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 'Question ?',
    required: true,
  })
  @IsString()
  @Expose()
  answer_text?: string;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
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

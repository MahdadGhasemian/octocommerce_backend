import { AbstractGetDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { GetGroupDto } from '../../groups/dto/get-group.dto';

export class GetLabelDto extends AbstractGetDto {
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
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  background_color?: string;

  @ApiProperty({
    type: GetGroupDto,
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => GetGroupDto)
  @Expose()
  groups?: GetGroupDto[];
}

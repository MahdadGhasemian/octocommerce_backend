import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { GetLabelDto } from './get-label.dto';
import { AbstractGetDto } from '@app/common';

export class GetGroupDto extends AbstractGetDto {
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
  @IsNumber()
  @IsOptional()
  @Expose()
  sequence_number?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  label_id?: number;

  @ApiProperty({
    type: GetLabelDto,
    required: true,
  })
  @Type(() => GetLabelDto)
  @Expose()
  label?: GetLabelDto;
}

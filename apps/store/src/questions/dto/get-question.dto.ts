import { AbstractGetDto, GetUserDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GetProductDto } from './get-product.dto';
import { GetAnswerDto } from './get-answer.dto';

export class GetQuestionDto extends AbstractGetDto {
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
  question_text?: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  user_has_bought_product?: boolean;

  @ApiProperty({
    type: GetAnswerDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetAnswerDto)
  @Expose()
  answers: GetAnswerDto[];

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @Expose()
  user_id?: number;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @Expose()
  product_id?: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Expose()
  product_code?: string;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  user?: GetUserDto;

  @ApiProperty({
    type: GetProductDto,
    required: true,
  })
  @Type(() => GetProductDto)
  @Expose()
  product?: GetProductDto;
}

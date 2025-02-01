import { BonusType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBonusDto {
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
    enum: BonusType,
    default: BonusType.PERCENTAGE,
    required: true,
  })
  @IsEnum(BonusType)
  bonus_type: BonusType;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  constant_amount?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  percentage_amount?: number;

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  is_enabled: boolean;

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_date?: Date;

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @ApiProperty({
    type: Number,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  allowed_user_ids: number[];

  @ApiProperty({
    type: Number,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  allowed_product_ids: number[];
}

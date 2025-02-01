import { BonusType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetAllowedUserDto } from './get-allowed-user.dto';
import { GetAllowedProductDto } from './get-allowed-product.dto';

export class GetBonusDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

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
    enum: BonusType,
    default: BonusType.PERCENTAGE,
    required: true,
  })
  @IsEnum(BonusType)
  @Expose()
  bonus_type?: BonusType;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  constant_amount?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  percentage_amount?: number;

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  @Expose()
  is_enabled?: boolean;

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  @Expose()
  start_date?: Date;

  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  @Expose()
  end_date?: Date;

  @ApiProperty({
    type: GetAllowedUserDto,
    isArray: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => GetAllowedUserDto)
  @Expose()
  allowed_users?: GetAllowedUserDto[];

  @ApiProperty({
    type: GetAllowedProductDto,
    isArray: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => GetAllowedProductDto)
  @Expose()
  allowed_products?: GetAllowedProductDto[];
}

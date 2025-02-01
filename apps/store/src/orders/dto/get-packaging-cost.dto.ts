import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPackagingCostDto {
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
    example: '100*150 CM',
    required: true,
  })
  @IsString()
  @Expose()
  title?: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsString()
  @Expose()
  cost?: number;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @Expose()
  shared_packaging?: boolean;
}

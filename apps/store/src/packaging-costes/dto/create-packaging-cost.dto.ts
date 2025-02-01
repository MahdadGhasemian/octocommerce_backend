import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreatePackagingCostDto {
  @ApiProperty({
    type: String,
    example: '100*150 CM',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  cost: number;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  shared_packaging: boolean;
}

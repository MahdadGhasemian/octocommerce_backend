import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class updateMassProductResultDto {
  @ApiProperty({
    example: 1058256,
  })
  @IsNumber()
  @Expose()
  affected?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RejectOrderDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  rejected_note: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  sequence_number: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  label_id: number;
}

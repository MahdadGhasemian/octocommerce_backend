import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class InfoEndpointAccessDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  key: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  tag: string;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  get: boolean | null;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  post: boolean | null;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  patch: boolean | null;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  delete: boolean | null;
}

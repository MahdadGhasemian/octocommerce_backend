import { AbstractGetDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetJobDto extends AbstractGetDto {
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  job_is_running?: boolean;
}

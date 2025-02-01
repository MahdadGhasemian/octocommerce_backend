// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAccessDto } from './create-access.dto';
import { IsArray, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { InfoEndpointAccessDto } from './info-endpoint-access.dto';

export class UpdateAccessDto extends PartialType(CreateAccessDto) {
  @ApiProperty({
    type: InfoEndpointAccessDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => InfoEndpointAccessDto)
  @Expose()
  info_endpoints?: InfoEndpointAccessDto[];
}

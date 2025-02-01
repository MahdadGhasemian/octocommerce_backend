import { ApiProperty } from '@nestjs/swagger';
import { CreateExternalSellerDto } from './create-external-seller.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateExternalSellerDto extends CreateExternalSellerDto {
  @ApiProperty({
    example: '1',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id?: number;
}

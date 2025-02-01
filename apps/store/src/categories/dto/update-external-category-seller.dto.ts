import { ApiProperty } from '@nestjs/swagger';
import { CreateExternalCategorySellerDto } from './create-external-category-seller.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateExternalCategorySellerDto extends CreateExternalCategorySellerDto {
  @ApiProperty({
    example: '1',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id?: number;
}

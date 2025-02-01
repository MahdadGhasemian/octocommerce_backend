import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadPublicFileWithUrlDto {
  @ApiProperty({
    example: 'http://www.localhost/image1000.jpg',
    required: true,
  })
  @IsString()
  target_url: string;
}

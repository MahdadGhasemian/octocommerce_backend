import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PublicFilesService } from './public-files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  FileTypeInvoiceValidationPipe,
  FileTypeValidationPipe,
  JwtAuthAccessGuard,
  Serialize,
} from '@app/common';
import { UploadPublicFileDto } from './dto/upload-public-file.dto';
import { UploadPublicFileResponseDto } from './dto/get-public-file-response.dto';
import { UploadPublicFileWithUrlDto } from './dto/upload-public-file-with-url.dto';
import { GetPublicFileDto } from './dto/get-public-file.dto';
import { Response } from 'express';

@ApiTags('PublicFiles')
@Controller('public-files')
export class PublicFilesController {
  constructor(private readonly publicFilesService: PublicFilesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadPublicFileDto,
  })
  @ApiOkResponse({
    type: UploadPublicFileResponseDto,
  })
  async uploadFile(
    @UploadedFile(new FileTypeValidationPipe())
    file: Express.Multer.File,
  ) {
    return this.publicFilesService.uploadFile(file);
  }

  @Post('external-url/upload')
  @Serialize(UploadPublicFileResponseDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: UploadPublicFileResponseDto,
  })
  async uploadFileWithUrl(
    @Body() uploadPublicFileWithUrlDto: UploadPublicFileWithUrlDto,
  ) {
    return this.publicFilesService.uploadFileWithUrl(
      uploadPublicFileWithUrlDto,
    );
  }

  @Post('invoice')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadPublicFileDto,
  })
  @ApiOkResponse({
    type: UploadPublicFileResponseDto,
  })
  async uploadInvoiceFile(
    @UploadedFile(new FileTypeInvoiceValidationPipe())
    file: Express.Multer.File,
  ) {
    return this.publicFilesService.uploadInvoiceFile(file);
  }

  @Get(':bucket_name/:object_name')
  async downloadFile(
    @Param('bucket_name') bucket_name: string,
    @Param('object_name') object_name: string,
    @Query() query: GetPublicFileDto,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.publicFilesService.downloadFile(
        bucket_name,
        object_name,
        query.width,
        query.quality,
      );

      // Set the appropriate headers to download the file
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${object_name}`,
      );

      // Pipe the stream to the response
      fileStream.pipe(res);
    } catch (error) {
      throw new NotFoundException('File Not Found');
    }
  }
}

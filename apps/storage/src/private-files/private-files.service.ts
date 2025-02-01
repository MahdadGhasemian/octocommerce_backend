import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UploadPrivateFileDto } from './dto/upload-private-file.dto';
import { ConfigService } from '@nestjs/config';
import { PrivateFilesRepository } from './private-files.repository';
import { PrivateFile, User } from '@app/storage';
import { IdentifierQuery } from '@app/common';
import { getBucketNamePrivate, getObjectName } from '../file/files.utils';
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class PrivateFilesService {
  protected readonly logger = new Logger(PrivateFilesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly privateFilesRepository: PrivateFilesRepository,
    private readonly minioService: MinioService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadPrivateFileDto,
    user: User,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const bucket_name = getBucketNamePrivate(file.mimetype);
    const object_name = getObjectName(file.originalname);

    // Upload file to MinIO
    await this.minioService.client.putObject(
      bucket_name,
      object_name,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    // Generate file URL
    const url = `${this.configService.get('BASE_PRIVATE_URL_DOWNLOAD')}${bucket_name}/${object_name}`;

    const privateFile = new PrivateFile({
      object_name,
      bucket_name,
      url,
      description: uploadFileDto.description,
      user_id: user.id,
    });

    await this.privateFilesRepository.create(privateFile);

    return {
      bucket_name,
      object_name,
      size: file.size,
      url,
      description: uploadFileDto.description,
    };
  }

  async downloadFile(
    bucket_name: string,
    object_name: string,
    _width: number,
    _quality: number,
    identifierQuery: IdentifierQuery,
  ) {
    try {
      const file = await this.privateFilesRepository.findOne({
        bucket_name,
        object_name,
        ...identifierQuery,
      });

      if (!file) {
        throw new ForbiddenException('File Access Denied!');
      }

      // Step 1: Get the object from MinIO
      const objectStream = await this.minioService.client.getObject(
        bucket_name,
        object_name,
      );

      return objectStream;
    } catch (error) {
      this.logger.error(`Error downloading file from MinIO: ${error.message}`);
      throw new NotFoundException('File not found');
    }
  }
}

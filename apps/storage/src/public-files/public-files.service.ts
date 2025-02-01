import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import Jimp from 'jimp';

import { ConfigService } from '@nestjs/config';
import {
  getBucketNamePublic,
  getBucketNameInvoice,
  getObjectName,
  getObjectNameInvoice,
  cacheNamePattern,
  getBucketNameCache,
  checkIfCapableToBeCached,
} from '../file/files.utils';
import { UploadPublicFileWithUrlDto } from 'apps/storage/src/public-files/dto/upload-public-file-with-url.dto';
import axios from 'axios';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';

@Injectable()
export class PublicFilesService {
  protected readonly logger = new Logger(PublicFilesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const bucket_name = getBucketNamePublic(file.mimetype);
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
    let url;
    if (checkIfCapableToBeCached(file.mimetype)) {
      url = `${this.configService.get('BASE_PUBLIC_URL_DOWNLOAD')}${bucket_name}/${object_name}`;
    } else {
      url = `${this.configService.get('MINIO_BASE_URL')}${bucket_name}/${object_name}`;
    }

    return {
      bucket_name,
      object_name,
      size: file.size,
      url,
    };
  }

  async uploadFileWithUrl(
    uploadPublicFileWithUrlDto: UploadPublicFileWithUrlDto,
  ) {
    const { target_url } = uploadPublicFileWithUrlDto;

    // Download the file using Axios
    const response = await axios({
      method: 'get',
      url: target_url,
      responseType: 'arraybuffer', // This will give the file in binary format
    });

    const mimeType = response.headers['content-type'];
    const length = response.headers['content-length'];

    const bucket_name = getBucketNamePublic(mimeType);
    const object_name = getObjectName(
      target_url.split('?')[0].split('/').pop(),
    );

    // Upload file to MinIO
    await this.minioService.client.putObject(
      bucket_name,
      object_name,
      response.data,
      length,
      {
        'Content-Type': mimeType,
      },
    );

    // Generate file URL
    let url;
    if (checkIfCapableToBeCached(mimeType)) {
      url = `${this.configService.get('BASE_PUBLIC_URL_DOWNLOAD')}${bucket_name}/${object_name}`;
    } else {
      url = `${this.configService.get('MINIO_BASE_URL')}${bucket_name}/${object_name}`;
    }

    // Return the file details
    return {
      bucket_name,
      object_name,
      size: length,
      url,
    };
  }

  async uploadInvoiceFile(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const bucket_name = getBucketNameInvoice();
    const object_name = getObjectNameInvoice(file.originalname);

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
    const url = `${this.configService.get('MINIO_BASE_URL')}${bucket_name}/${object_name}`;

    return {
      bucket_name,
      object_name,
      size: file.size,
      url,
    };
  }

  async downloadFile(
    bucket_name: string,
    object_name: string,
    width: number,
    quality: number,
  ) {
    try {
      const resizedObjectName = cacheNamePattern(object_name, width, quality);
      const bucketCacheName = getBucketNameCache();

      // Step 1: Check if the resized image already exists in MinIO
      try {
        await this.minioService.client.statObject(
          bucketCacheName,
          resizedObjectName,
        );

        // If the resized image exists, retrieve and return it
        const resizedObjectStream = await this.minioService.client.getObject(
          bucketCacheName,
          resizedObjectName,
        );
        return resizedObjectStream;
      } catch (error) {
        // If the resized image does not exist, proceed to step 2
        this.logger.log('Resized image not found, creating a new one...');
      }

      // Step 2: Retrieve the original image from MinIO
      const originalObjectStream: Stream =
        await this.minioService.client.getObject(bucket_name, object_name);

      // Convert stream to buffer for processing
      const originalBuffer = await this.streamToBuffer(originalObjectStream);

      // Step 3: Use Jimp to resize the image
      const image = await Jimp.read(originalBuffer);
      if (width) await image.resize(width, Jimp.AUTO); // Resizing by width, maintaining aspect ratio
      if (quality) await image.quality(quality); // Set the image quality

      // Step 4: Get the processed image as a buffer
      const resizedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

      // Step 5: Save the resized image back to MinIO
      await this.minioService.client.putObject(
        bucketCacheName,
        resizedObjectName,
        resizedImageBuffer,
        resizedImageBuffer.length,
        // {
        //   'Content-Type': 'image/jpeg', // Adjust if necessary
        // },
      );

      // Step 6: Return the resized image stream (or the buffer)
      return this.bufferToStream(resizedImageBuffer);
    } catch (error) {
      this.logger.error(`Error downloading file from MinIO: ${error.message}`);
      throw new NotFoundException('File not found');
    }
  }

  // Helper function to convert a stream to a buffer
  private async streamToBuffer(stream: Stream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  // Helper function to convert a buffer back to a stream
  private bufferToStream(buffer: Buffer): Stream {
    const stream = new Stream.PassThrough();
    stream.end(buffer);
    return stream;
  }
}

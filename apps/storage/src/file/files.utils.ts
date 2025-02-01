import {
  COMPRESSED_BUCKET_NAME,
  COMPRESSED_PRIVATE_BUCKET_NAME,
  DOCUMENT_BUCKET_NAME,
  DOCUMENT_INVOICE_BUCKET_NAME,
  DOCUMENT_PRIVATE_BUCKET_NAME,
  IMAGE_BUCKET_NAME,
  IMAGE_CACHE_BUCKET_NAME,
  IMAGE_PRIVATE_BUCKET_NAME,
  MEDIA_BUCKET_NAME,
  MEDIA_PRIVATE_BUCKET_NAME,
  SUPPORTED_COMPRESSED_FILES,
  SUPPORTED_DOCUMENTS,
  SUPPORTED_IMAGE,
  SUPPORTED_IMAGE_TO_RESIZE,
  SUPPORTED_MEDIA_FILES,
} from '@app/common';
import * as fs from 'fs';
import Jimp from 'jimp';

export const cacheNamePattern = (
  imageName: string,
  width: number,
  quality: number,
) => {
  return (
    (width ? 'w_' + width + '_' : '') +
    (quality ? 'q_' + quality + '_' : '') +
    imageName
  );
};

export const createFolderRecursive = async (dirPath: string) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      } else {
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const coldResize = async (
  imagePath: string,
  outputPath: string,
  size: number,
  quality: number,
) => {
  const image = await Jimp.read(imagePath);
  if (size) await image.resize(size, Jimp.AUTO);
  if (quality) await image.quality(quality);
  await image.writeAsync(outputPath);

  return outputPath;
};

export const getObjectName = (originalname: string): string => {
  return `${Date.now()}-${originalname}`;
};

export const getBucketNamePublic = (mimetype: any): string => {
  const bucket_name = SUPPORTED_IMAGE.includes(mimetype)
    ? IMAGE_BUCKET_NAME
    : SUPPORTED_DOCUMENTS.includes(mimetype)
      ? DOCUMENT_BUCKET_NAME
      : SUPPORTED_MEDIA_FILES.includes(mimetype)
        ? MEDIA_BUCKET_NAME
        : SUPPORTED_COMPRESSED_FILES.includes(mimetype)
          ? COMPRESSED_BUCKET_NAME
          : undefined;

  return bucket_name;
};

export const getObjectNameInvoice = (originalname: string): string => {
  return originalname;
};

export const getBucketNameInvoice = (): string => {
  return DOCUMENT_INVOICE_BUCKET_NAME;
};

export const getBucketNamePrivate = (mimetype: any): string => {
  const bucket_name = SUPPORTED_IMAGE.includes(mimetype)
    ? IMAGE_PRIVATE_BUCKET_NAME
    : SUPPORTED_DOCUMENTS.includes(mimetype)
      ? DOCUMENT_PRIVATE_BUCKET_NAME
      : SUPPORTED_MEDIA_FILES.includes(mimetype)
        ? MEDIA_PRIVATE_BUCKET_NAME
        : SUPPORTED_COMPRESSED_FILES.includes(mimetype)
          ? COMPRESSED_PRIVATE_BUCKET_NAME
          : undefined;

  return bucket_name;
};

export const getBucketNameCache = (): string => {
  return IMAGE_CACHE_BUCKET_NAME;
};

export const checkIfCapableToBeCached = (mimetype: any): boolean => {
  return SUPPORTED_IMAGE_TO_RESIZE.includes(mimetype);
};

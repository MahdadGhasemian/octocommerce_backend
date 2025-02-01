import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { PrivateFile } from '@app/storage';

@Injectable()
export class PrivateFilesRepository extends AbstractRepository<PrivateFile> {
  protected readonly logger = new Logger(PrivateFilesRepository.name);

  constructor(
    @InjectRepository(PrivateFile)
    privateFilesRepository: Repository<PrivateFile>,
    entityManager: EntityManager,
  ) {
    super(privateFilesRepository, entityManager);
  }
}

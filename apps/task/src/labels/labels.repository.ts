import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Label } from '@app/task';
@Injectable()
export class LabelsRepository extends AbstractRepository<Label> {
  protected readonly logger = new Logger(LabelsRepository.name);

  constructor(
    @InjectRepository(Label) labelsRepository: Repository<Label>,
    entityManager: EntityManager,
  ) {
    super(labelsRepository, entityManager);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Setting } from '@app/store';

@Injectable()
export class SettingsRepository extends AbstractRepository<Setting> {
  protected readonly logger = new Logger(SettingsRepository.name);

  constructor(
    @InjectRepository(Setting) settingsRepository: Repository<Setting>,
    entityManager: EntityManager,
  ) {
    super(settingsRepository, entityManager);
  }
}

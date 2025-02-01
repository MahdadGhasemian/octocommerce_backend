import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Scrape } from '@app/bot';

@Injectable()
export class ScrapesRepository extends AbstractRepository<Scrape> {
  protected readonly logger = new Logger(ScrapesRepository.name);

  constructor(
    @InjectRepository(Scrape) scrapesRepository: Repository<Scrape>,
    entityManager: EntityManager,
  ) {
    super(scrapesRepository, entityManager);
  }
}

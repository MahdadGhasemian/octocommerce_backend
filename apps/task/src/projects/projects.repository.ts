import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Project } from '@app/task';
@Injectable()
export class ProjectsRepository extends AbstractRepository<Project> {
  protected readonly logger = new Logger(ProjectsRepository.name);

  constructor(
    @InjectRepository(Project) projectsRepository: Repository<Project>,
    entityManager: EntityManager,
  ) {
    super(projectsRepository, entityManager);
  }
}

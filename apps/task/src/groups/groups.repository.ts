import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Group } from '@app/task';
@Injectable()
export class GroupsRepository extends AbstractRepository<Group> {
  protected readonly logger = new Logger(GroupsRepository.name);

  constructor(
    @InjectRepository(Group) groupsRepository: Repository<Group>,
    entityManager: EntityManager,
  ) {
    super(groupsRepository, entityManager);
  }
}

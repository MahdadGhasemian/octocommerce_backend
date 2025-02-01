import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Board } from '@app/task';
@Injectable()
export class BoardsRepository extends AbstractRepository<Board> {
  protected readonly logger = new Logger(BoardsRepository.name);

  constructor(
    @InjectRepository(Board) boardsRepository: Repository<Board>,
    entityManager: EntityManager,
  ) {
    super(boardsRepository, entityManager);
  }
}

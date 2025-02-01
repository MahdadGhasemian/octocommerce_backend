import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, TreeRepository } from 'typeorm';
import { Question } from '@app/store';

@Injectable()
export class QuestionsRepository extends AbstractRepository<Question> {
  protected readonly logger = new Logger(QuestionsRepository.name);
  private treeRepository: TreeRepository<Question>;

  constructor(
    @InjectRepository(Question) questionsRepository: Repository<Question>,
    entityManager: EntityManager,
  ) {
    super(questionsRepository, entityManager);

    this.treeRepository = entityManager.getTreeRepository(Question);
  }

  async findTrees() {
    return this.treeRepository.findTrees();
  }

  async getDescendants() {
    const roots = await this.treeRepository.findRoots();

    if (!roots?.length) {
      throw new NotFoundException('Root Question not found.');
    }

    return this.treeRepository.findDescendants(roots[0]);
  }
}

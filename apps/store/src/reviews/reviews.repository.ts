import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, TreeRepository } from 'typeorm';
import { Review } from '@app/store';

@Injectable()
export class ReviewsRepository extends AbstractRepository<Review> {
  protected readonly logger = new Logger(ReviewsRepository.name);
  private treeRepository: TreeRepository<Review>;

  constructor(
    @InjectRepository(Review) reviewsRepository: Repository<Review>,
    entityManager: EntityManager,
  ) {
    super(reviewsRepository, entityManager);

    this.treeRepository = entityManager.getTreeRepository(Review);
  }

  async findTrees() {
    return this.treeRepository.findTrees();
  }

  async getDescendants() {
    const roots = await this.treeRepository.findRoots();

    if (!roots?.length) {
      throw new NotFoundException('Root Review not found.');
    }

    return this.treeRepository.findDescendants(roots[0]);
  }
}

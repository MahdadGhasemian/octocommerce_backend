import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, TreeRepository } from 'typeorm';
import { Category } from '@app/store';

@Injectable()
export class CategoriesRepository extends AbstractRepository<Category> {
  protected readonly logger = new Logger(CategoriesRepository.name);
  private treeRepository: TreeRepository<Category>;

  constructor(
    @InjectRepository(Category) categoriesRepository: Repository<Category>,
    entityManager: EntityManager,
  ) {
    super(categoriesRepository, entityManager);

    this.treeRepository = entityManager.getTreeRepository(Category);
  }

  async findTrees() {
    return this.treeRepository.findTrees();
  }

  async getDescendants() {
    const roots = await this.treeRepository.findRoots();

    if (!roots?.length) {
      throw new NotFoundException('Root Category not found.');
    }

    return this.treeRepository.findDescendants(roots[0]);
  }

  async findDescendants(root) {
    return this.treeRepository.findDescendants(root);
  }
}

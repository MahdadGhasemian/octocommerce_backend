import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { GetCategoryDto } from './dto/get-category.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import {
  CATEGORY_ADMIN_PAGINATION_CONFIG,
  CATEGORY_FAST_SEARCH_PAGINATION_CONFIG,
  CATEGORY_PAGINATION_CONFIG,
  CATEGORY_SITEMAP_PAGINATION_CONFIG,
} from './pagination-config';
import { Category, ExternalCategorySeller } from '@app/store';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let parent;

    // find parent with parent_id
    if (createCategoryDto.parent_id) {
      parent = await this.findOne({ id: createCategoryDto.parent_id });
    }
    // find parent with parent_name
    else if (createCategoryDto.parent_name) {
      parent = await this.findOne({ name: createCategoryDto.parent_name });
    }
    // find parent with parent's externale resources name
    else if (createCategoryDto.parent_external_category_sellers_name) {
      parent = await this.findOneWithExternalSerouceName({
        parent_external_category_sellers_name:
          createCategoryDto.parent_external_category_sellers_name,
      });
    }

    if (!parent) {
      throw new NotFoundException('Parent Not Found');
    }

    const category = new Category({
      ...createCategoryDto,
      parent,
      external_category_sellers:
        createCategoryDto?.external_category_sellers?.map(
          (sellers) =>
            new ExternalCategorySeller({
              ...sellers,
            }),
        ),
    });

    const result = await this.categoriesRepository.create(category);

    return this.findOneAdmin({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.categoriesRepository.entityRepository,
      CATEGORY_PAGINATION_CONFIG,
    );
  }

  async findAllAdmin(query: PaginateQuery) {
    return paginate(
      query,
      this.categoriesRepository.entityRepository,
      CATEGORY_ADMIN_PAGINATION_CONFIG,
    );
  }

  async findAllSitemap(query: PaginateQuery) {
    return paginate(
      query,
      this.categoriesRepository.entityRepository,
      CATEGORY_SITEMAP_PAGINATION_CONFIG,
    );
  }

  async findAllFastSearch(query: PaginateQuery) {
    return paginate(
      query,
      this.categoriesRepository.entityRepository,
      CATEGORY_FAST_SEARCH_PAGINATION_CONFIG,
    );
  }

  async findOne(categoryDto: GetCategoryDto) {
    return this.categoriesRepository.findOne(categoryDto);
  }

  async findOneAdmin(
    categoryDto: Omit<GetCategoryDto, 'external_category_sellers'>,
  ) {
    return this.categoriesRepository.findOne(categoryDto, {
      external_category_sellers: true,
    });
  }

  async findOneWithExternalSerouceName(categoryDto: GetCategoryDto) {
    return this.categoriesRepository.entityRepository
      .createQueryBuilder('category')
      .innerJoin('category.external_category_sellers', 'externalSeller')
      .where('externalSeller.store_category_english_name = :name', {
        name: categoryDto.parent_external_category_sellers_name,
      })
      .getOne();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Find the category to be updated
    const category = await this.findOneAdmin({ id });

    // Handle parent update if provided
    if (
      updateCategoryDto.parent_id ||
      updateCategoryDto.parent_name ||
      updateCategoryDto.parent_external_category_sellers_name
    ) {
      let parent;

      // find parent with parent_id
      if (updateCategoryDto.parent_id) {
        parent = await this.findOne({ id: updateCategoryDto.parent_id });
      }
      // find parent with parent_name
      else if (updateCategoryDto.parent_name) {
        parent = await this.findOne({ name: updateCategoryDto.parent_name });
      }
      // find parent with parent's externale resources name
      else if (updateCategoryDto.parent_external_category_sellers_name) {
        parent = await this.findOneWithExternalSerouceName({
          parent_external_category_sellers_name:
            updateCategoryDto.parent_external_category_sellers_name,
        });
      }

      category.parent = parent;
    }

    // Update the category's other fields
    category.name = updateCategoryDto.name ?? category.name;
    category.description =
      updateCategoryDto.description ?? category.description;
    category.image = updateCategoryDto.image ?? category.image;

    if (updateCategoryDto.external_category_sellers) {
      category.external_category_sellers =
        updateCategoryDto.external_category_sellers?.map((seller) => {
          const data = category.external_category_sellers.find(
            (_) => +_?.id === +seller?.id,
          );

          if (data) {
            return {
              ...data,
              store_name: seller.store_name,
              store_category_url: seller.store_category_url,
              store_category_english_name: seller.store_category_english_name,
              store_category_persian_name: seller.store_category_persian_name,
            };
          } else {
            return new ExternalCategorySeller({
              store_name: seller.store_name,
              store_category_url: seller.store_category_url,
              store_category_english_name: seller.store_category_english_name,
              store_category_persian_name: seller.store_category_persian_name,
            });
          }
        });
    }

    const result = await this.categoriesRepository.save(category);

    return this.findOneAdmin({ id: result.id });
  }

  async remove(id: number) {
    return this.categoriesRepository.findOneAndDelete({ id });
  }

  async findTrees() {
    return this.categoriesRepository.findTrees();
  }

  async getDescendants() {
    return this.categoriesRepository.getDescendants();
  }

  async readDescendants(categoryDto: GetCategoryDto) {
    const rootCategory =
      await this.categoriesRepository.findOneNoCheck(categoryDto);

    if (rootCategory) {
      return this.categoriesRepository.findDescendants(rootCategory);
    }

    return [];
  }
}

import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import {
  PRODUCT_ADMIN_PAGINATION_CONFIG,
  PRODUCT_ADMIN_RESOURCE_MANAGING_PAGINATION_CONFIG,
  PRODUCT_FAST_SEARCH_PAGINATION_CONFIG,
  PRODUCT_PAGINATION_CONFIG,
  PRODUCT_SITEMAP_PAGINATION_CONFIG,
  PRODUCT_TO_SCRAPE_PAGINATION_CONFIG,
} from './pagination-config';
import { Category, ExternalSeller, Product, Specification } from '@app/store';
import { CategoriesService } from '../categories/categories.service';
import { SettingsService } from '../settings/settings.service';
import { PackagingCost } from '@app/store/entities/packaging-cost.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesService: CategoriesService,
    private readonly settingsService: SettingsService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // read setting
    const setting = await this.settingsService.readSetting();
    const { product_code_prefix } = setting;

    let product = new Product({
      ...createProductDto,
      category: new Category({ id: createProductDto.category_id }),

      specifications: createProductDto?.specifications?.map(
        (spec) =>
          new Specification({
            ...spec,
          }),
      ),
      external_sellers: createProductDto?.external_sellers?.map(
        (sellers) =>
          new ExternalSeller({
            ...sellers,
          }),
      ),

      packaging_cost: new PackagingCost({
        id: createProductDto.packaging_cost_id,
      }),
    });

    // Create product in DB to get the ID
    product = await this.productsRepository.create(product);

    // Set product code and save
    product.product_code = this.getProductCode(product_code_prefix, product.id);
    product = await this.productsRepository.save(product);

    return this.findOneAdmin({ id: product.id });
  }

  async findAll(query: PaginateQuery) {
    // const queryBuilder = this.productsRepository.entityRepository
    //   .createQueryBuilder('product')
    //   .leftJoinAndSelect('product.specifications', 'specification')
    //   .where('specification.key = :key AND specification.value = :value', {
    //     key: 'Capacitance',
    //     value: '1000uF',
    //   });

    // return paginate(query, queryBuilder, PRODUCT_PAGINATION_CONFIG);

    const queryModified = await this.checkCategoryIdQuery(query);

    return paginate(
      queryModified,
      this.productsRepository.entityRepository,
      PRODUCT_PAGINATION_CONFIG,
    );
  }

  async findAllAdmin(query: PaginateQuery) {
    const queryModified = await this.checkCategoryIdQuery(query);

    return paginate(
      queryModified,
      this.productsRepository.entityRepository,
      PRODUCT_ADMIN_PAGINATION_CONFIG,
    );
  }

  async findAllAdminResourceManaging(query: PaginateQuery) {
    return paginate(
      query,
      this.productsRepository.entityRepository,
      PRODUCT_ADMIN_RESOURCE_MANAGING_PAGINATION_CONFIG,
    );
  }

  async findAllSitemap(query: PaginateQuery) {
    return paginate(
      query,
      this.productsRepository.entityRepository,
      PRODUCT_SITEMAP_PAGINATION_CONFIG,
    );
  }

  async findAllFastSearch(query: PaginateQuery) {
    return paginate(
      query,
      this.productsRepository.entityRepository,
      PRODUCT_FAST_SEARCH_PAGINATION_CONFIG,
    );
  }

  async findAllToScrape(query: PaginateQuery) {
    const result = await paginate(
      query,
      this.productsRepository.entityRepository,
      PRODUCT_TO_SCRAPE_PAGINATION_CONFIG,
    );

    return {
      ...result,
      data: result.data?.map((product) => {
        return {
          id: product.id,
          name: product.name,
          product_code: product.product_code,
          sale_price: product.sale_price,
          external_sellers: product.external_sellers,
        };
      }),
    };
  }

  async findOne(
    productDto: Omit<
      GetProductDto,
      'images' | 'reviews' | 'specifications' | 'external_sellers' | 'keywords'
    >,
  ) {
    return this.productsRepository.findOne(productDto, {
      category: true,
      specifications: true,
      packaging_cost: true,
    });
  }

  async findOneAdmin(
    productDto: Omit<
      GetProductDto,
      'images' | 'reviews' | 'specifications' | 'external_sellers' | 'keywords'
    >,
  ) {
    return this.productsRepository.findOne(productDto, {
      category: true,
      specifications: true,
      external_sellers: true,
      packaging_cost: true,
    });
  }

  async read(
    productDto: Omit<
      GetProductDto,
      'images' | 'reviews' | 'specifications' | 'external_sellers' | 'keywords'
    >,
    relations?: object,
  ) {
    return relations
      ? this.productsRepository.findOne(productDto, relations)
      : this.productsRepository.findOne(productDto);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOneAdmin({ id });

    // update
    product.name = updateProductDto.name ?? product.name;
    product.description = updateProductDto.description ?? product.description;
    product.image = updateProductDto.image ?? product.image;
    product.images = updateProductDto.images ?? product.images;
    product.keywords = updateProductDto.keywords ?? product.keywords;
    product.available_quantity = updateProductDto.available_quantity ?? product.available_quantity;
    product.sale_price = updateProductDto.sale_price ?? product.sale_price;
    product.discount_percentage =
      updateProductDto.discount_percentage ?? product.discount_percentage;
    product.discount_amount =
      updateProductDto.discount_amount ?? product.discount_amount;
    product.price_scale_value =
      updateProductDto.price_scale_value ?? product.price_scale_value;
    product.is_scalable_price =
      updateProductDto.is_scalable_price ?? product.is_scalable_price;
    product.unit = updateProductDto.unit ?? product.unit;
    product.is_active = updateProductDto.is_active ?? product.is_active;
    product.is_online_payment_allowed =
      updateProductDto.is_online_payment_allowed ??
      product.is_online_payment_allowed;

    if (updateProductDto.category_id) {
      product.category = new Category({ id: updateProductDto.category_id });
    }

    if (updateProductDto.specifications) {
      product.specifications = updateProductDto.specifications?.map((spec) => {
        const data = product.specifications.find((_) => +_?.id === +spec?.id);

        if (data) {
          return {
            ...data,
            key: spec.key,
            value: spec.value,
            key_2: spec.key_2,
            value_2: spec.value_2,
          };
        } else {
          return new Specification({
            key: spec.key,
            value: spec.value,
            key_2: spec.key_2,
            value_2: spec.value_2,
            product_id: product.id,
          });
        }
      });
    }

    if (updateProductDto.external_sellers) {
      product.external_sellers = updateProductDto.external_sellers?.map(
        (seller) => {
          const data = product.external_sellers.find(
            (_) => +_?.id === +seller?.id,
          );

          if (data) {
            return {
              ...data,
              store_name: seller.store_name,
              store_product_url: seller.store_product_url,
            };
          } else {
            return new ExternalSeller({
              store_name: seller.store_name,
              store_product_url: seller.store_product_url,
            });
          }
        },
      );
    }

    if (updateProductDto.packaging_cost_id) {
      product.packaging_cost = new PackagingCost({
        id: updateProductDto.packaging_cost_id,
      });
    }

    const result = await this.productsRepository.save(product);

    return this.findOneAdmin({ id: result.id });
  }

  async updateSalePriceByScrape(id: number, sale_price: number) {
    // read setting
    const setting = await this.settingsService.readSetting();
    const base_price_scale_amount = +setting.base_price_scale_amount;

    // read product
    const product = await this.findOneAdmin({ id });

    // update
    product.sale_price = sale_price;
    if (sale_price > 0 && base_price_scale_amount > 0) {
      product.price_scale_value = sale_price / base_price_scale_amount;
      product.is_scalable_price = true;
    } else {
      product.is_scalable_price = false;
    }

    await this.productsRepository.save(product);

    return;
  }

  async remove(id: number) {
    return this.productsRepository.findOneAndDelete({ id });
  }

  async updateAllSalePriceBasedOnScale() {
    // read setting
    const setting = await this.settingsService.readSetting();
    const { base_price_scale_amount } = setting;

    // update products
    return this.productsRepository.entityRepository
      .createQueryBuilder()
      .update(Product)
      .set({
        sale_price: () => `price_scale_value * ${base_price_scale_amount}`,
      })
      .where('is_scalable_price = :isScalable', { isScalable: true })
      .execute();
  }

  private getProductCode = (product_code_prefix: string, id: number) => {
    return `${product_code_prefix}${id}`;
  };

  private checkCategoryIdQuery = async (query: PaginateQuery) => {
    // Get the categoryId from the query filter if it exists
    const categoryFilter = query.filter?.['category.id'];
    const categoryIds: number[] = [];

    if (categoryFilter) {
      // Handle cases where categoryFilter is a single value or an array
      const categoryIdList = Array.isArray(categoryFilter)
        ? categoryFilter.map((id) => parseInt(id.replace(/^.*:/, ''), 10))
        : [parseInt(categoryFilter.replace(/^.*:/, ''), 10)];

      // Remove any invalid IDs (NaN values)
      const validCategoryIds = categoryIdList.filter((id) => !isNaN(id));

      // Collect all descendant category IDs for each category in the list
      for (const categoryId of validCategoryIds) {
        const descendants = await this.categoriesService.readDescendants({
          id: categoryId,
        });

        categoryIds.push(...descendants.map((category) => category.id));
      }
    }

    // Modify the pagination config to include the descendant category filter
    return categoryIds?.length
      ? {
          ...query,
          filter: {
            ...query.filter,
            'category.id':
              categoryIds?.length === 1
                ? `$eq:${categoryIds[0]}`
                : categoryIds.map((id) => `$or:$eq:${id}`),
          },
        }
      : query;
  };
}

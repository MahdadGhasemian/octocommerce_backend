import { Inject, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsRepository } from './reviews.repository';
import { GetReviewDto } from './dto/get-review.dto';
import { GetReviewGistQueryDto } from './dto/get-review-gist-query.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { REVIEW_PAGINATION_CONFIG } from './pagination-config';
import { Product, Review, User } from '@app/store';
import {
  EVENT_NAME_REVIEW_CREATED,
  IdentifierQuery,
  NOTIFICATION_SERVICE,
  ReviewCreatedEvent,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notficationClient: ClientProxy,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    // read Product
    const product = await this.productsService.findOne({
      id: createReviewDto.product_id,
    });

    let review = new Review({ ...createReviewDto });
    review.user = new User({ id: user.id });
    review.product = new Product({ id: product.id });
    review.product_code = product.product_code;

    let user_has_bought_product = false;
    try {
      const order = await this.ordersService.findOneWithoutJoin(
        { user_id: user.id, is_paid: true },
        {},
      );
      user_has_bought_product = !!order;
    } catch (error) {}

    review.user_has_bought_product = user_has_bought_product;

    review = await this.reviewsRepository.create(review);

    this.notficationClient.emit(
      EVENT_NAME_REVIEW_CREATED,
      new ReviewCreatedEvent(review),
    );

    return review;
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.reviewsRepository.entityRepository,
      REVIEW_PAGINATION_CONFIG,
    );
  }

  async findOne(reviewDto: Omit<GetReviewDto, 'pros' | 'cons' | 'product'>) {
    return this.reviewsRepository.findOne(
      { ...reviewDto },
      { product: true, user: true },
    );
  }

  async update(
    reviewDto: Omit<GetReviewDto, 'pros' | 'cons' | 'product'>,
    updateReviewDto: UpdateReviewDto,
    identifierQuery: IdentifierQuery,
  ) {
    const review = await this.findOne({ ...reviewDto, ...identifierQuery });

    review.title = updateReviewDto.title ?? review.title;
    review.content = updateReviewDto.content ?? review.content;
    review.rating = updateReviewDto.rating ?? review.rating;
    review.pros = updateReviewDto.pros ?? review.pros;
    review.cons = updateReviewDto.cons ?? review.cons;
    review.images = updateReviewDto.images ?? review.images;
    review.videos = updateReviewDto.videos ?? review.videos;
    review.recommended = updateReviewDto.recommended ?? review.recommended;
    review.is_anonymous = updateReviewDto.is_anonymous ?? review.is_anonymous;

    const result = await this.reviewsRepository.save(review);

    return this.findOne({ id: result.id });
  }

  async remove(
    reviewDto: Omit<GetReviewDto, 'pros' | 'cons' | 'product'>,
    identifierQuery: IdentifierQuery,
  ) {
    return this.reviewsRepository.findOneAndDelete({
      ...reviewDto,
      ...identifierQuery,
    });
  }

  async getGist(query: GetReviewGistQueryDto) {
    const { product_id, product_code } = query;

    const queryBuilder = this.reviewsRepository.entityRepository
      .createQueryBuilder('review')
      .select('COUNT(review.id)', 'count')
      .addSelect('AVG(review.rating)', 'average_rating');

    if (product_id) {
      queryBuilder.where('review.product_id = :product_id', { product_id });
    }

    if (product_code) {
      // Use .orWhere if product_id also exists, otherwise use .where
      if (product_id) {
        queryBuilder.orWhere('review.product_code = :product_code', {
          product_code,
        });
      } else {
        queryBuilder.where('review.product_code = :product_code', {
          product_code,
        });
      }
    }

    const stats = await queryBuilder.getRawOne();

    const roundedAverage =
      Math.round((parseFloat(stats.average_rating) || 0) * 2) / 2;

    return {
      count: parseInt(stats.count, 10),
      average_rating: roundedAverage.toFixed(1),
    };
  }
}

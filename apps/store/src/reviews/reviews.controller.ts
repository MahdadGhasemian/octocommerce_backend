import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  Identifier,
  IdentifierQuery,
  JwtAuthAccessGuard,
  NoCache,
  Serialize,
} from '@app/common';
import { GetReviewDto } from './dto/get-review.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { REVIEW_PAGINATION_CONFIG } from './pagination-config';
import { ListReviewDto } from './dto/list-review.dto';
import { User } from '@app/store';
import { GetReviewGistDto } from 'apps/store/src/reviews/dto/get-review-gist.dto';
import { GetReviewGistQueryDto } from 'apps/store/src/reviews/dto/get-review-gist-query.dto';

@ApiTags('Reviews')
@NoCache()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetReviewDto)
  @ApiOkResponse({
    type: GetReviewDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get()
  @Serialize(ListReviewDto)
  @ApiOkPaginatedResponse(GetReviewDto, REVIEW_PAGINATION_CONFIG)
  @ApiPaginationQuery(REVIEW_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.reviewsService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetReviewDto)
  @ApiOkResponse({
    type: GetReviewDto,
  })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne({ id: +id });
  }

  @Patch(':id')
  @Serialize(GetReviewDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetReviewDto,
  })
  async update(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(
      { id: +id },
      updateReviewDto,
      identifierQuery,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.reviewsService.remove({ id: +id }, identifierQuery);
  }

  @Get('gist/review')
  @Serialize(GetReviewGistDto)
  @ApiOkResponse({
    type: GetReviewGistDto,
  })
  async getGist(@Query() query: GetReviewGistQueryDto) {
    return this.reviewsService.getGist(query);
  }
}

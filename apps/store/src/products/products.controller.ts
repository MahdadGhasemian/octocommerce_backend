import {
  EVENT_NAME_PRODUCT_SALE_PRICE_UPDATE,
  EVENT_NAME_READ_PRODUCTS,
  FoceToClearCache,
  GeneralCache,
  JwtAuthAccessGuard,
  MessageAckInterceptor,
  NoCache,
  Serialize,
} from '@app/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { GetProductDto } from './dto/get-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import {
  PRODUCT_ADMIN_PAGINATION_CONFIG,
  PRODUCT_ADMIN_RESOURCE_MANAGING_PAGINATION_CONFIG,
  PRODUCT_FAST_SEARCH_PAGINATION_CONFIG,
  PRODUCT_PAGINATION_CONFIG,
  PRODUCT_SITEMAP_PAGINATION_CONFIG,
} from './pagination-config';
import { ListProductDto } from './dto/list-product.dto';
import { GetProductAdminDto } from './dto/get-product-admin.dto';
import { ListProductAdminDto } from './dto/list-product-admin.dto';
import { updateMassProductResultDto } from './dto/update-mass-product-result.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { ProductSalePriceUpdateEvent } from '@app/common/events/product.event';

@ApiTags('Products')
@GeneralCache()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProductAdminDto)
  @ApiOkResponse({
    type: GetProductAdminDto,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Serialize(ListProductDto)
  @ApiOkPaginatedResponse(GetProductDto, PRODUCT_PAGINATION_CONFIG)
  @ApiPaginationQuery(PRODUCT_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetProductDto)
  @ApiOkResponse({
    type: GetProductDto,
  })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProductAdminDto)
  @ApiOkResponse({
    type: GetProductAdminDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Get('list/admin')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListProductAdminDto)
  @ApiOkPaginatedResponse(GetProductAdminDto, PRODUCT_ADMIN_PAGINATION_CONFIG)
  @ApiPaginationQuery(PRODUCT_ADMIN_PAGINATION_CONFIG)
  async findAllAdmin(@Paginate() query: PaginateQuery) {
    return this.productsService.findAllAdmin(query);
  }

  @Get('list/admin/resource/managing')
  @UseGuards(JwtAuthAccessGuard)
  @NoCache()
  @Serialize(ListProductAdminDto)
  @ApiOkPaginatedResponse(
    GetProductAdminDto,
    PRODUCT_ADMIN_RESOURCE_MANAGING_PAGINATION_CONFIG,
  )
  @ApiPaginationQuery(PRODUCT_ADMIN_RESOURCE_MANAGING_PAGINATION_CONFIG)
  async findAllAdminResourceManaging(@Paginate() query: PaginateQuery) {
    return this.productsService.findAllAdminResourceManaging(query);
  }

  @Get(':id/admin')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProductAdminDto)
  @ApiOkResponse({
    type: GetProductAdminDto,
  })
  async findOneAdmin(@Param('id') id: string) {
    return this.productsService.findOneAdmin({ id: +id });
  }

  @Get(':product_code/code')
  @Serialize(GetProductDto)
  @ApiOkResponse({
    type: GetProductDto,
  })
  async findOneByCode(@Param('product_code') product_code: string) {
    return this.productsService.findOne({ product_code });
  }

  @Get('sitemap/list')
  @NoCache()
  @Serialize(ListProductDto)
  @ApiOkPaginatedResponse(GetProductDto, PRODUCT_SITEMAP_PAGINATION_CONFIG)
  @ApiPaginationQuery(PRODUCT_SITEMAP_PAGINATION_CONFIG)
  async findAllSitemap(@Paginate() query: PaginateQuery) {
    return this.productsService.findAllSitemap(query);
  }

  @Get('fast/search')
  @Serialize(ListProductDto)
  @ApiOkPaginatedResponse(GetProductDto, PRODUCT_FAST_SEARCH_PAGINATION_CONFIG)
  @ApiPaginationQuery(PRODUCT_FAST_SEARCH_PAGINATION_CONFIG)
  async findAllFastSearch(@Paginate() query: PaginateQuery) {
    return this.productsService.findAllFastSearch(query);
  }

  @Patch('mass/update/price-scale')
  @UseGuards(JwtAuthAccessGuard)
  @FoceToClearCache('/products')
  @Serialize(updateMassProductResultDto)
  @ApiOkResponse({
    type: updateMassProductResultDto,
  })
  async updateAllSalePriceBasedOnScale() {
    return this.productsService.updateAllSalePriceBasedOnScale();
  }

  @MessagePattern(EVENT_NAME_READ_PRODUCTS)
  @NoCache()
  @UseInterceptors(MessageAckInterceptor)
  async readProducts(@Payload() data: { query: PaginateQuery }) {
    const { query } = data;

    return this.productsService.findAllToScrape(query);
  }

  @EventPattern(EVENT_NAME_PRODUCT_SALE_PRICE_UPDATE)
  @UseInterceptors(MessageAckInterceptor)
  @FoceToClearCache('/products')
  async updateSalePrice(@Payload() payload: ProductSalePriceUpdateEvent) {
    const { product_id, sale_price } = payload;

    await this.productsService.updateSalePriceByScrape(product_id, sale_price);
  }
}

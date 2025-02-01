import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  GeneralCache,
  JwtAuthAccessGuard,
  NoCache,
  Serialize,
} from '@app/common';
import { GetCategoryDto } from './dto/get-category.dto';
import { GetTreeDto } from './dto/get-tree.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import {
  CATEGORY_ADMIN_PAGINATION_CONFIG,
  CATEGORY_FAST_SEARCH_PAGINATION_CONFIG,
  CATEGORY_PAGINATION_CONFIG,
  CATEGORY_SITEMAP_PAGINATION_CONFIG,
} from './pagination-config';
import { ListCategoryDto } from './dto/list-category.dto';
import { GetCategoryAdminDto } from './dto/get-category-admin.dto';
import { ListCategoryAdminDto } from './dto/list-category-admin.dto';

@ApiTags('Categories')
@GeneralCache()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Serialize(GetCategoryAdminDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetCategoryAdminDto,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Serialize(ListCategoryDto)
  @ApiOkPaginatedResponse(GetCategoryDto, CATEGORY_PAGINATION_CONFIG)
  @ApiPaginationQuery(CATEGORY_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetCategoryDto)
  @ApiOkResponse({
    type: GetCategoryDto,
  })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne({ id: +id });
  }

  @Patch(':id')
  @Serialize(GetCategoryAdminDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetCategoryAdminDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

  @Get('list/admin')
  @Serialize(ListCategoryAdminDto)
  @ApiOkPaginatedResponse(GetCategoryAdminDto, CATEGORY_ADMIN_PAGINATION_CONFIG)
  @ApiPaginationQuery(CATEGORY_ADMIN_PAGINATION_CONFIG)
  async findAllAdmin(@Paginate() query: PaginateQuery) {
    return this.categoriesService.findAllAdmin(query);
  }

  @Get(':id/admin')
  @Serialize(GetCategoryAdminDto)
  @ApiOkResponse({
    type: GetCategoryAdminDto,
  })
  async findOneAdmin(@Param('id') id: string) {
    return this.categoriesService.findOneAdmin({ id: +id });
  }

  @Get('get/tree')
  @Serialize(GetTreeDto)
  @ApiOkResponse({
    type: [GetTreeDto],
  })
  async getTree() {
    return this.categoriesService.findTrees();
  }

  @Get('get/flat')
  @ApiOkResponse({
    type: [GetCategoryDto],
  })
  async getFlat() {
    return this.categoriesService.getDescendants();
  }

  @Get('sitemap/list')
  @NoCache()
  @Serialize(ListCategoryAdminDto)
  @ApiOkPaginatedResponse(
    GetCategoryAdminDto,
    CATEGORY_SITEMAP_PAGINATION_CONFIG,
  )
  @ApiPaginationQuery(CATEGORY_SITEMAP_PAGINATION_CONFIG)
  async findAllSitemap(@Paginate() query: PaginateQuery) {
    return this.categoriesService.findAllSitemap(query);
  }

  @Get('fast/search')
  @Serialize(ListCategoryDto)
  @ApiOkPaginatedResponse(
    GetCategoryDto,
    CATEGORY_FAST_SEARCH_PAGINATION_CONFIG,
  )
  @ApiPaginationQuery(CATEGORY_FAST_SEARCH_PAGINATION_CONFIG)
  async findAllFastSearch(@Paginate() query: PaginateQuery) {
    return this.categoriesService.findAllFastSearch(query);
  }
}

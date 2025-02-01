import { GeneralCache, JwtAuthAccessGuard, Serialize } from '@app/common';
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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PackagingCostsService } from './packaging-costs.service';
import { GetPackagingCostDto } from './dto/get-packaging-cost.dto';
import { CreatePackagingCostDto } from './dto/create-packaging-cost.dto';
import { UpdatePackagingCostDto } from './dto/update-packaging-cost.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { ListPackagingCostDto } from './dto/list-packaging-cost.dto';
import { PACKAGING_COST_PAGINATION_CONFIG } from './pagination-config';

@ApiTags('PackagingCosts')
@GeneralCache()
@Controller('packaging-costs')
export class PackagingCostsController {
  constructor(private readonly packagingCostsService: PackagingCostsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetPackagingCostDto)
  @ApiOkResponse({
    type: GetPackagingCostDto,
  })
  async create(@Body() createPackagingCostDto: CreatePackagingCostDto) {
    return this.packagingCostsService.create(createPackagingCostDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListPackagingCostDto)
  @ApiOkPaginatedResponse(GetPackagingCostDto, PACKAGING_COST_PAGINATION_CONFIG)
  @ApiPaginationQuery(PACKAGING_COST_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.packagingCostsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetPackagingCostDto)
  @ApiOkResponse({
    type: GetPackagingCostDto,
  })
  async findOne(@Param('id') id: string) {
    return this.packagingCostsService.findOne({ id: +id });
  }

  @Patch(':id')
  @Serialize(GetPackagingCostDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetPackagingCostDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePackagingCostDto: UpdatePackagingCostDto,
  ) {
    return this.packagingCostsService.update(+id, updatePackagingCostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.packagingCostsService.remove(+id);
  }
}

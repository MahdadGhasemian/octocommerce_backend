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
import { WarehousesService } from './warehouses.service';
import { GetWarehouseDto } from './dto/get-warehouse.dto';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { WAREHOUSE_PAGINATION_CONFIG } from './pagination-config';
import { ListWarehouseDto } from './dto/list-warehouse.dto';

@ApiTags('Warehouses')
@GeneralCache()
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetWarehouseDto)
  @ApiOkResponse({
    type: GetWarehouseDto,
  })
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListWarehouseDto)
  @ApiOkPaginatedResponse(GetWarehouseDto, WAREHOUSE_PAGINATION_CONFIG)
  @ApiPaginationQuery(WAREHOUSE_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.warehousesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetWarehouseDto)
  @ApiOkResponse({
    type: GetWarehouseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.warehousesService.findOne({ id: +id });
  }

  @Patch(':id')
  @Serialize(GetWarehouseDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetWarehouseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(+id, updateWarehouseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.warehousesService.remove(+id);
  }
}

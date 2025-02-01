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
import { DeliveryMethodsService } from './delivery-methods.service';
import { GetDeliveryMethodDto } from './dto/get-delivery-method.dto';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery-method.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { ListDeliveryMethodDto } from './dto/list-delivery-method.dto';
import { DELIVERY_METHOD_PAGINATION_CONFIG } from './pagination-config';

@ApiTags('DeliveryMethods')
@GeneralCache()
@Controller('delivery-methods')
export class DeliveryMethodsController {
  constructor(
    private readonly deliveryMethodsService: DeliveryMethodsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetDeliveryMethodDto)
  @ApiOkResponse({
    type: GetDeliveryMethodDto,
  })
  async create(@Body() createDeliveryMethodDto: CreateDeliveryMethodDto) {
    return this.deliveryMethodsService.create(createDeliveryMethodDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListDeliveryMethodDto)
  @ApiOkPaginatedResponse(
    GetDeliveryMethodDto,
    DELIVERY_METHOD_PAGINATION_CONFIG,
  )
  @ApiPaginationQuery(DELIVERY_METHOD_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.deliveryMethodsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetDeliveryMethodDto)
  @ApiOkResponse({
    type: GetDeliveryMethodDto,
  })
  async findOne(@Param('id') id: string) {
    return this.deliveryMethodsService.findOne({ id: +id });
  }

  @Patch(':id')
  @Serialize(GetDeliveryMethodDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetDeliveryMethodDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDeliveryMethodDto: UpdateDeliveryMethodDto,
  ) {
    return this.deliveryMethodsService.update(+id, updateDeliveryMethodDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.deliveryMethodsService.remove(+id);
  }
}

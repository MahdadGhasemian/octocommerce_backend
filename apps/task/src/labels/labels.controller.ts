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
import { LabelsService } from './labels.service';
import { GetLabelDto } from './dto/get-label.dto';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { LABEL_PAGINATION_CONFIG } from './pagination-config';
import { ListLabelDto } from './dto/list-label.dto';

@ApiTags('Labels')
@GeneralCache()
@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetLabelDto)
  @ApiOkResponse({
    type: GetLabelDto,
  })
  async create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelsService.create(createLabelDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListLabelDto)
  @ApiOkPaginatedResponse(GetLabelDto, LABEL_PAGINATION_CONFIG)
  @ApiPaginationQuery(LABEL_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.labelsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetLabelDto)
  @ApiOkResponse({
    type: GetLabelDto,
  })
  async findOne(@Param('id') id: string) {
    return this.labelsService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetLabelDto)
  @ApiOkResponse({
    type: GetLabelDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateLabelDto: UpdateLabelDto,
  ) {
    return this.labelsService.update(+id, updateLabelDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.labelsService.remove(+id);
  }
}

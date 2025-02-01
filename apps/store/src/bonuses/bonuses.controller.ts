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
import { BonusesService } from './bonuses.service';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GeneralCache, JwtAuthAccessGuard, Serialize } from '@app/common';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { BONUS_PAGINATION_CONFIG } from './pagination-config';
import { GetBonusDto } from './dto/get-bonus.dto';
import { ListBonusDto } from './dto/list-bonus.dto';

@ApiTags('Bonuses')
@GeneralCache()
@Controller('bonuses')
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetBonusDto)
  @ApiOkResponse({
    type: GetBonusDto,
  })
  async create(@Body() createBonusDto: CreateBonusDto) {
    return this.bonusesService.create(createBonusDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListBonusDto)
  @ApiOkPaginatedResponse(GetBonusDto, BONUS_PAGINATION_CONFIG)
  @ApiPaginationQuery(BONUS_PAGINATION_CONFIG)
  @ApiOkResponse({
    type: [GetBonusDto],
  })
  async findAll(@Paginate() query: PaginateQuery) {
    return this.bonusesService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetBonusDto)
  @ApiOkResponse({
    type: GetBonusDto,
  })
  async findOne(@Param('id') id: string) {
    return this.bonusesService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetBonusDto)
  @ApiOkResponse({
    type: GetBonusDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateBonusDto: UpdateBonusDto,
  ) {
    return this.bonusesService.update(+id, updateBonusDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.bonusesService.remove(+id);
  }
}

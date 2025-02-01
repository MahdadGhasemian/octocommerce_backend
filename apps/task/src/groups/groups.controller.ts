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
import { GroupsService } from './groups.service';
import { GetGroupDto } from './dto/get-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { GROUP_PAGINATION_CONFIG } from './pagination-config';
import { ListGroupDto } from './dto/list-group.dto';

@ApiTags('Groups')
@GeneralCache()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetGroupDto)
  @ApiOkResponse({
    type: GetGroupDto,
  })
  async create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListGroupDto)
  @ApiOkPaginatedResponse(GetGroupDto, GROUP_PAGINATION_CONFIG)
  @ApiPaginationQuery(GROUP_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.groupsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetGroupDto)
  @ApiOkResponse({
    type: GetGroupDto,
  })
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetGroupDto)
  @ApiOkResponse({
    type: GetGroupDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}

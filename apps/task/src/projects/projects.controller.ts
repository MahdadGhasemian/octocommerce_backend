import {
  CurrentUser,
  GeneralCache,
  JwtAuthAccessGuard,
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
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { GetProjectDto } from './dto/get-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { PROJECT_PAGINATION_CONFIG } from './pagination-config';
import { User } from '@app/task';
import { ListProjectDto } from './dto/list-project.dto';

@ApiTags('Projects')
@GeneralCache()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProjectDto)
  @ApiOkResponse({
    type: GetProjectDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListProjectDto)
  @ApiOkPaginatedResponse(GetProjectDto, PROJECT_PAGINATION_CONFIG)
  @ApiPaginationQuery(PROJECT_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProjectDto)
  @ApiOkResponse({
    type: GetProjectDto,
  })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetProjectDto)
  @ApiOkResponse({
    type: GetProjectDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}

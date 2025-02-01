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
import { BoardsService } from './boards.service';
import { GetBoardDto } from './dto/get-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UpdateSequenceBoardDto } from './dto/update-sequence-board.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import {
  BOARD_FULL_PAGINATION_CONFIG,
  BOARD_PAGINATION_CONFIG,
} from './pagination-config';
import { User } from '@app/task';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ListBoardDto } from './dto/list-board.dto';

@ApiTags('Boards')
@GeneralCache()
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetBoardDto)
  @ApiOkResponse({
    type: GetBoardDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardsService.create(createBoardDto, user);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListBoardDto)
  @ApiOkPaginatedResponse(GetBoardDto, BOARD_PAGINATION_CONFIG)
  @ApiPaginationQuery(BOARD_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.boardsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetBoardDto)
  @ApiOkResponse({
    type: GetBoardDto,
  })
  async findOne(@Param('id') id: string) {
    return this.boardsService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetBoardDto)
  @ApiOkResponse({
    type: GetBoardDto,
  })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(+id, updateBoardDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(@Param('id') id: string) {
    return this.boardsService.remove(+id);
  }

  @Patch('multiple/sequence')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetBoardDto)
  @ApiOkResponse({
    type: GetBoardDto,
  })
  async sequenceNumbersUpdate(
    @Body() updateSequenceBoardDto: UpdateSequenceBoardDto,
  ) {
    return this.boardsService.sequenceNumbersUpdate(updateSequenceBoardDto);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetBoardDto)
  @ApiOkResponse({
    type: GetBoardDto,
  })
  async addCommentUserComment(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.boardsService.addCommentUserComment(
      +id,
      createCommentDto,
      user,
    );
  }

  @Get('flow/list')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkPaginatedResponse(GetBoardDto, BOARD_FULL_PAGINATION_CONFIG)
  @ApiPaginationQuery(BOARD_FULL_PAGINATION_CONFIG)
  async findAllWithFullRelations(@Paginate() query: PaginateQuery) {
    return this.boardsService.findAllWithFullRelations(query);
  }
}

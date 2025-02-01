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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  Identifier,
  IdentifierQuery,
  JwtAuthAccessGuard,
  NoCache,
  Serialize,
} from '@app/common';
import { GetQuestionDto } from './dto/get-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { REVIEW_PAGINATION_CONFIG } from './pagination-config';
import { ListQuestionDto } from './dto/list-question.dto';
import { User } from '@app/store';

@ApiTags('Questions')
@NoCache()
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetQuestionDto)
  @ApiOkResponse({
    type: GetQuestionDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionsService.create(createQuestionDto, user);
  }

  @Get()
  @Serialize(ListQuestionDto)
  @ApiOkPaginatedResponse(GetQuestionDto, REVIEW_PAGINATION_CONFIG)
  @ApiPaginationQuery(REVIEW_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.questionsService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetQuestionDto)
  @ApiOkResponse({
    type: GetQuestionDto,
  })
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne({ id: +id });
  }

  @Patch(':id')
  @Serialize(GetQuestionDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetQuestionDto,
  })
  async update(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionsService.update(
      { id: +id },
      updateQuestionDto,
      identifierQuery,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.questionsService.remove({ id: +id }, identifierQuery);
  }

  @Post(':id/answers')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetQuestionDto)
  @ApiOkResponse({
    type: GetQuestionDto,
  })
  async createAnswer(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.questionsService.createAnswer(
      { id: +id },
      createAnswerDto,
      user,
    );
  }
}

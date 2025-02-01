import {
  Controller,
  Body,
  UseGuards,
  Post,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { SupportsService } from './supports.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  EVENT_NAME_SEND_SEND_SMS_SENT,
  JwtAuthAccessGuard,
  MessageAckInterceptor,
  NoCache,
  SendShortMessageSentEvent,
  Serialize,
} from '@app/common';
import { GetShortMessageDto } from './dto/get-short-message.dto';
import { SendShortMessageDto } from './dto/send-short-message.dto';
import { User } from '@app/store';
import { ListShortMessageDto } from './dto/list-short-message.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { SHORT_MESSAGE_PAGINATION_CONFIG } from './pagination-config';
import { EventPattern, Payload } from '@nestjs/microservices';

@ApiTags('Supports')
@NoCache()
@Controller('supports')
export class SupportsController {
  constructor(private readonly supportsService: SupportsService) {}

  @Post('short-messages')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetShortMessageDto)
  @ApiOkResponse({
    type: GetShortMessageDto,
  })
  async sendShortMessage(
    @CurrentUser() user: User,
    @Body() sendShortMessageDto: SendShortMessageDto,
  ) {
    return this.supportsService.sendShortMessage(sendShortMessageDto, user);
  }

  @Get('short-messages')
  @Serialize(ListShortMessageDto)
  @ApiOkPaginatedResponse(GetShortMessageDto, SHORT_MESSAGE_PAGINATION_CONFIG)
  @ApiPaginationQuery(SHORT_MESSAGE_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.supportsService.findAll(query);
  }

  @EventPattern(EVENT_NAME_SEND_SEND_SMS_SENT)
  @UseInterceptors(MessageAckInterceptor)
  async createShortMessage(@Payload() payload: SendShortMessageSentEvent) {
    const { mobile_phone, title_type, text_list } = payload;

    await this.supportsService.createShortMessage({
      mobile_phone,
      title_type,
      text_list,
    });
  }
}

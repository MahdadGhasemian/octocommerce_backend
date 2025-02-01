import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  UseInterceptors,
  Redirect,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  Identifier,
  IdentifierQuery,
  JwtAuthAccessGuard,
  NoCache,
  Serialize,
} from '@app/common';
import { GetPaymentDto } from './dto/get-payment.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { PAYMENT_PAGINATION_CONFIG } from './pagination-config';
import { RejectPaymentDto } from './dto/reject-payment.dto';
import { User } from '@app/store';
import { ListPaymentDto } from './dto/list-payment.dto';
import { SadadResultPaymentDto } from './dto/sadad-result-payment.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreatePaymentForOtherUserDto } from './dto/create-payment-for-other-user.dto';

@ApiTags('Payments')
@NoCache()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetPaymentDto)
  @ApiOkResponse({
    type: GetPaymentDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(createPaymentDto, user);
  }

  @Post('other/user')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetPaymentDto)
  @ApiOkResponse({
    type: GetPaymentDto,
  })
  async createForOtherUser(
    @Body() createPaymentForOtherUserDto: CreatePaymentForOtherUserDto,
  ) {
    return this.paymentsService.createForOtherUser(
      createPaymentForOtherUserDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListPaymentDto)
  @ApiOkPaginatedResponse(GetPaymentDto, PAYMENT_PAGINATION_CONFIG)
  @ApiPaginationQuery(PAYMENT_PAGINATION_CONFIG)
  async findAll(
    @Identifier() identifierQuery: IdentifierQuery,
    @Paginate() query: PaginateQuery,
  ) {
    return this.paymentsService.findAll(query, identifierQuery);
  }

  @Patch(':id/status/confirm')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetPaymentDto)
  @ApiOkResponse({
    type: GetPaymentDto,
  })
  async confirmOrder(@CurrentUser() user: User, @Param('id') id: string) {
    return this.paymentsService.confirmPayment({ id: +id }, user);
  }

  @Patch(':id/status/reject')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetPaymentDto)
  @ApiOkResponse({
    type: GetPaymentDto,
  })
  async rejectOrder(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() rejectPaymentDto: RejectPaymentDto,
  ) {
    return this.paymentsService.rejectPayment(
      { id: +id },
      rejectPaymentDto,
      user,
    );
  }

  @Post('result/sadad')
  @Redirect()
  @UseInterceptors(AnyFilesInterceptor())
  async resultSadad(@Body() sadadResultPaymentDto: SadadResultPaymentDto) {
    return this.paymentsService.resultSadad(sadadResultPaymentDto);
  }
}

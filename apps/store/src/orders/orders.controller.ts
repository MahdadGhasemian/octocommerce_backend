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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  Identifier,
  IdentifierQuery,
  JwtAuthAccessGuard,
  NoCache,
  Serialize,
} from '@app/common';
import { GetOrderDto } from './dto/get-order.dto';
import { ORDER_PAGINATION_CONFIG } from './pagination-config';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { RejectOrderDto } from './dto/reject-order.dto';
import { CreateOrderItemDto } from './dto/items/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/items/update-order-item.dto';
import { CreateOrderDeliveryDto } from './dto/delivery/create-order-delivery.dto';
import { UpdateOrderDeliveryDto } from './dto/delivery/update-order-delivery.dto';
import { RejectOrderDeliveryDto } from './dto/delivery/reject-order-delivery.dto';
import { User } from '@app/store';
import { ListOrderDto } from './dto/list-order.dto';
import { CreateOrderForOtherUserDto } from './dto/create-order-for-other-user.dto';

@ApiTags('Orders')
@NoCache()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Post('other/user')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async createForOtherUser(
    @Body() createOrderForOtherUserDto: CreateOrderForOtherUserDto,
  ) {
    return this.ordersService.createForOtherUser(createOrderForOtherUserDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListOrderDto)
  @ApiOkPaginatedResponse(GetOrderDto, ORDER_PAGINATION_CONFIG)
  @ApiPaginationQuery(ORDER_PAGINATION_CONFIG)
  async findAll(
    @Identifier() identifierQuery: IdentifierQuery,
    @Paginate() query: PaginateQuery,
  ) {
    return this.ordersService.findAll(query, identifierQuery);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async findOne(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.ordersService.findOne({ id: +id }, identifierQuery);
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async update(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(
      { id: +id },
      updateOrderDto,
      identifierQuery,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.ordersService.remove({ id: +id }, identifierQuery);
  }

  @Delete(':id/clear')
  @UseGuards(JwtAuthAccessGuard)
  async clearOrderItems(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.ordersService.clearItems({ id: +id }, identifierQuery);
  }

  @Patch(':id/status/confirm')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async confirmOrder(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.ordersService.confirmOrder({ id: +id }, identifierQuery);
  }

  @Patch(':id/status/reject')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async rejectOrder(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Body() rejectOrderDto: RejectOrderDto,
  ) {
    return this.ordersService.rejectOrder(
      { id: +id },
      rejectOrderDto,
      identifierQuery,
    );
  }

  @Patch(':id/status/cancel')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async cancelOrder(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.ordersService.cancelOrder({ id: +id }, identifierQuery);
  }

  @Post(':id/items')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async addNewItem(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    return this.ordersService.addNewItem(
      { id: +id },
      createOrderItemDto,
      identifierQuery,
    );
  }

  @Patch(':id/items/:order_item_id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async editItem(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Param('order_item_id') order_item_id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.ordersService.editItem(
      { id: +id },
      +order_item_id,
      updateOrderItemDto,
      identifierQuery,
    );
  }

  @Post(':id/delivery')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async addDeliveryCondition(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Body() createOrderDeliveryDto: CreateOrderDeliveryDto,
  ) {
    return this.ordersService.addDeliveryCondition(
      { id: +id },
      createOrderDeliveryDto,
      identifierQuery,
    );
  }

  @Patch(':id/delivery/:delivery_id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async updateDeliveryCondition(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Param('delivery_id') delivery_id: string,
    @Body() updateOrderDeliveryDto: UpdateOrderDeliveryDto,
  ) {
    return this.ordersService.updateDeliveryCondition(
      { id: +id },
      +delivery_id,
      updateOrderDeliveryDto,
      identifierQuery,
    );
  }

  @Patch(':id/delivery/:delivery_id/status/confirm')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async confirmDeliveryCondition(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Param('delivery_id') delivery_id: string,
  ) {
    return this.ordersService.confirmDeliveryCondition(
      { id: +id },
      +delivery_id,
      identifierQuery,
    );
  }

  @Patch(':id/delivery/:delivery_id/status/reject')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async rejectDeliveryCondition(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Param('delivery_id') delivery_id: string,
    @Body() rejectOrderDeliveryDto: RejectOrderDeliveryDto,
  ) {
    return this.ordersService.rejectDeliveryCondition(
      { id: +id },
      +delivery_id,
      rejectOrderDeliveryDto,
      identifierQuery,
    );
  }

  @Get(':id/regenerate/order/invoice')
  @UseGuards(JwtAuthAccessGuard)
  @NoCache()
  @Serialize(GetOrderDto)
  @ApiOkResponse({
    type: GetOrderDto,
  })
  async regenerateOrderInvoice(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.ordersService.regenerateOrderInvoice(
      { id: +id },
      identifierQuery,
    );
  }
}

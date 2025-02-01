import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import {
  EVENT_NAME_GET_USERS_WITH_NOTIFICATION_ACCESS,
  FoceToClearCache,
  GeneralCache,
  MessageAckInterceptor,
  Serialize,
} from '@app/common';
import { JwtAuthAccessGuard } from '../guards/jwt-auth-access.guard';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './pagination-config';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { UpdateUserAccessDto } from './dto/update-user-access.dto';
import { ListUserDto } from './dto/list-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserNotificationAccessDto } from './dto/get-user-notification.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateNewUserDto } from './dto/create-new-user.dto';

@ApiTags('Users')
@GeneralCache()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async create(@Body() createNewUserDto: CreateNewUserDto) {
    return this.usersService.createNewUser(createNewUserDto);
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @Serialize(ListUserDto)
  @ApiOkPaginatedResponse(GetUserDto, USER_PAGINATION_CONFIG)
  @ApiPaginationQuery(USER_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @FoceToClearCache('/users')
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(':id/access')
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @FoceToClearCache('/users')
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async updateUserAccess(
    @Param('id') id: string,
    @Body() updateUserAccessDto: UpdateUserAccessDto,
  ) {
    return this.usersService.updateUserAccess(+id, updateUserAccessDto);
  }

  @Patch(':id/settings')
  @UseGuards(JwtAuthAccessGuard)
  @UseGuards(JwtAuthGuard)
  @FoceToClearCache('/users')
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async updateUserSetting(
    @Param('id') id: string,
    @Body() updateUserSettingDto: UpdateUserSettingDto,
  ) {
    return this.usersService.updateUserSetting(+id, updateUserSettingDto);
  }

  @MessagePattern(EVENT_NAME_GET_USERS_WITH_NOTIFICATION_ACCESS)
  @UseInterceptors(MessageAckInterceptor)
  async getUsersWithNotificationAccess(
    @Payload() data: Partial<{ query: GetUserNotificationAccessDto }>,
  ) {
    return this.usersService.findAllWithNotificationAccess(data.query);
  }
}

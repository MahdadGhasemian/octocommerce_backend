import {
  CurrentUser,
  Identifier,
  IdentifierQuery,
  JwtAuthAccessGuard,
  NoCache,
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
import { ContactsService } from './contacts.service';
import { GetContactDto } from './dto/get-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { CONTACT_PAGINATION_CONFIG } from './pagination-config';
import { ListContactDto } from './dto/list-contact.dto';
import { User } from '@app/store';
import { CreateContactForOtherUserDto } from './dto/create-contact-for-other-user.dto';

@ApiTags('Contacts')
@NoCache()
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetContactDto)
  @ApiOkResponse({
    type: GetContactDto,
  })
  async create(
    @CurrentUser() user: User,
    @Body() createContactDto: CreateContactDto,
  ) {
    return this.contactsService.create(createContactDto, user);
  }

  @Post('other/user')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetContactDto)
  @ApiOkResponse({
    type: GetContactDto,
  })
  async createForOtherUser(
    @Body() createContactForOtherUserDto: CreateContactForOtherUserDto,
  ) {
    return this.contactsService.createForOtherUser(
      createContactForOtherUserDto,
    );
  }

  @Get()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListContactDto)
  @ApiOkPaginatedResponse(GetContactDto, CONTACT_PAGINATION_CONFIG)
  @ApiPaginationQuery(CONTACT_PAGINATION_CONFIG)
  async findAll(
    @Identifier() identifierQuery: IdentifierQuery,
    @Paginate() query: PaginateQuery,
  ) {
    return this.contactsService.findAll(query, identifierQuery);
  }

  @Get(':id')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetContactDto)
  @ApiOkResponse({
    type: GetContactDto,
  })
  async findOne(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.contactsService.findOne({ id: +id }, identifierQuery);
  }

  @Patch(':id')
  @Serialize(GetContactDto)
  @UseGuards(JwtAuthAccessGuard)
  @ApiOkResponse({
    type: GetContactDto,
  })
  async update(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.update(+id, updateContactDto, identifierQuery);
  }

  @Delete(':id')
  @UseGuards(JwtAuthAccessGuard)
  async remove(
    @Identifier() identifierQuery: IdentifierQuery,
    @Param('id') id: string,
  ) {
    return this.contactsService.remove(+id, identifierQuery);
  }
}

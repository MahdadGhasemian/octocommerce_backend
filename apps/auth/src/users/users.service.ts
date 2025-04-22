import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersRepository } from './users.repository';
import {
  AuthCommon,
  BOT_SERVICE,
  EVENT_NAME_USER_CREATED,
  EVENT_NAME_USER_UPDATED,
  NOTIFICATION_SERVICE,
  STORE_SERVICE,
  UserCreatedEvent,
  UserUpdatedEvent,
} from '@app/common';
import { AccessesService } from '../accesses/accesses.service';
import { In } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from './pagination-config';
import { User } from '@app/auth';
import { UpdateUserAccessDto } from './dto/update-user-access.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { GetUserNotificationAccessDto } from './dto/get-user-notification.dto';
import { ConfigService } from '@nestjs/config';
import { CreateNewUserDto } from './dto/create-new-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly accessesService: AccessesService,
    private readonly configService: ConfigService,
    @Inject(STORE_SERVICE) private readonly storeClient: ClientProxy,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationClient: ClientProxy,
    @Inject(BOT_SERVICE) private readonly botClient: ClientProxy,
  ) {}

  async createNewUser(createNewUserDto: CreateNewUserDto) {
    const access_id = this.configService.get('DEFAULT_ACCESS_ID');
    const password = createNewUserDto?.password
      ? createNewUserDto.password
      : this.generateStrongPassword();

    const hashed_password = await AuthCommon.createHash(password);
    const need_to_set_name =
      !createNewUserDto.first_name && !createNewUserDto.last_name;

    const user = await this.create({
      mobile_phone: createNewUserDto.mobile_phone,
      mobile_phone_is_verified: false,
      first_name: createNewUserDto.first_name,
      last_name: createNewUserDto.last_name,
      avatar: createNewUserDto.avatar,
      hashed_password,
      created_by_system: true,
      need_to_set_name,
      access_ids: [access_id],
    });

    return this.findOne({ id: user.id });
  }

  async propareNewUser(createUserDto: CreateUserDto) {
    const hashed_password = await AuthCommon.createHash(createUserDto.password);

    const user = await this.create({
      mobile_phone: createUserDto.mobile_phone,
      mobile_phone_is_verified: createUserDto.mobile_phone_is_verified,
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      avatar: createUserDto.avatar,
      hashed_password,
      created_by_system: createUserDto.created_by_system,
      need_to_set_name: createUserDto.need_to_set_name,
      access_ids: createUserDto.access_ids,
    });

    return this.findOne({ id: user.id });
  }

  async create(createUserDto: CreateUserDto & { hashed_password: string }) {
    const accesses = await this.accessesService.readAccesses({
      id: In(createUserDto.access_ids),
    });

    const userData = new User({
      ...createUserDto,
      accesses,
    });

    const user = await this.usersRepository.create(userData);
    delete user.hashed_password;

    const eventData = new UserCreatedEvent(user);
    this.storeClient.emit(EVENT_NAME_USER_CREATED, eventData);
    this.notificationClient.emit(EVENT_NAME_USER_CREATED, eventData);
    this.botClient.emit(EVENT_NAME_USER_CREATED, eventData);

    return user;
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.usersRepository.entityRepository,
      USER_PAGINATION_CONFIG,
    );
  }

  async findAllWithNotificationAccess(
    getUserNotificationAccessDto: GetUserNotificationAccessDto,
  ) {
    return this.usersRepository.find({
      accesses: {
        ...getUserNotificationAccessDto,
      },
    });
  }

  async findOne(getUserDto: Omit<GetUserDto, 'accesses'>) {
    return this.usersRepository.findOne(getUserDto, {
      accesses: true,
    });
  }

  async findOneNoCheck(settingDto: Omit<GetUserDto, 'accesses'>) {
    return this.usersRepository.findOneNoCheck(settingDto, {
      accesses: true,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const default_first_name = this.configService.get<string>(
      'DEFAULT_USER_FIRST_NAME',
    );
    const default_last_name = this.configService.get<string>(
      'DEFAULT_USER_LAST_NAME',
    );

    const need_to_set_name = !(
      updateUserDto.first_name !== default_first_name ||
      updateUserDto.last_name !== default_last_name
    );

    const user = await this.usersRepository.findOneAndUpdate(
      { id },
      { ...updateUserDto, need_to_set_name },
    );

    delete user.hashed_password;

    const eventData = new UserUpdatedEvent(user);
    this.storeClient.emit(EVENT_NAME_USER_UPDATED, eventData);
    this.notificationClient.emit(EVENT_NAME_USER_UPDATED, eventData);
    this.botClient.emit(EVENT_NAME_USER_UPDATED, eventData);

    return user;
  }

  async updateMobilePhoneVerificationStatus(
    id: number,
    mobile_phone_is_verified: boolean,
  ) {
    await this.usersRepository.findOneAndUpdate(
      { id },
      {
        mobile_phone_is_verified,
      },
    );

    return this.findOne({ id });
  }

  async updatePassword(id: number, password: string) {
    const hashed_password = await AuthCommon.createHash(password);

    await this.usersRepository.findOneAndUpdate(
      { id },
      {
        hashed_password,
      },
    );

    return this.findOne({ id });
  }

  async updateEmail(id: number, email: string) {
    const user = await this.usersRepository.findOneAndUpdate(
      { id },
      {
        email,
      },
    );

    delete user.hashed_password;

    const eventData = new UserUpdatedEvent(user);
    this.storeClient.emit(EVENT_NAME_USER_UPDATED, eventData);
    this.notificationClient.emit(EVENT_NAME_USER_UPDATED, eventData);
    this.botClient.emit(EVENT_NAME_USER_UPDATED, eventData);

    return this.findOne({ id });
  }

  async updateUserAccess(id: number, updateUserAccessDto: UpdateUserAccessDto) {
    const accesses = await this.accessesService.readAccesses({
      id: In(updateUserAccessDto.access_ids),
    });

    const user = await this.usersRepository.findOne({ id }, { accesses: true });

    user.accesses = accesses;

    await this.usersRepository.save(user);

    return user;
  }

  async updateUserSetting(
    id: number,
    updateUserSettingDto: UpdateUserSettingDto,
  ) {
    const user = await this.usersRepository.findOneAndUpdate(
      { id },
      { ...updateUserSettingDto },
    );

    delete user.hashed_password;

    const eventData = new UserUpdatedEvent(user);
    this.storeClient.emit(EVENT_NAME_USER_UPDATED, eventData);
    this.notificationClient.emit(EVENT_NAME_USER_UPDATED, eventData);
    this.botClient.emit(EVENT_NAME_USER_UPDATED, eventData);

    return user;
  }

  async remove(id: number) {
    return this.usersRepository.findOneAndDelete({ id });
  }

  async getUser(getUserDto: Omit<GetUserDto, 'accesses'>) {
    const user = await this.usersRepository.findOne(getUserDto, {
      accesses: {
        endpoints: true,
      },
    });

    delete user.hashed_password;

    return user;
  }

  private generateStrongPassword(): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;<>,.?/~';
    let password = '';
    for (let i = 0; i < 64; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }
}

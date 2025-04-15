import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import {
  AuthCommon,
  EVENT_NAME_SEND_SEND_SMS_ACCOUNT_OTP,
  NOTIFICATION_SERVICE,
  SendShortMessageAccountOtpEvent,
} from '@app/common';
import { CookieOptions, Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GetMobilePhoneOtpDto } from './dto/get-mobile-phone-otp.dto';
import { GetEmailOtpDto } from './dto/get-email-otp.dto';
import { ConfirmMobilePhoneOtpDto } from './dto/confirm-mobile-phone-otp.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@app/auth';
import { EditInfoDto } from './dto/edit-info.dto';
import { ClientProxy } from '@nestjs/microservices';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notficationClient: ClientProxy,
  ) { }

  async getMobilePhoneOtp(getOtpDto: GetMobilePhoneOtpDto) {
    const otp = this.generateOtpCode();
    const data_string = JSON.stringify({
      mobile_phone: getOtpDto.mobile_phone,
      otp,
    });

    const hashed_code = await AuthCommon.createHash(data_string);

    // Send OTP code via SMS service
    this.notficationClient.emit(
      EVENT_NAME_SEND_SEND_SMS_ACCOUNT_OTP,
      new SendShortMessageAccountOtpEvent(
        getOtpDto.mobile_phone,
        otp.toString(),
      ),
    );

    // Store OTP and Hashed_code in Redis with a TTL
    const ttl = this.configService.get('OTP_SMS_EXPIRATION');
    const cache_prefix = this.configService.getOrThrow<string>(
      'REDIS_CACHE_KEY_PREFIX_AUTH',
    );
    await this.cacheManager.set(
      `${cache_prefix}:${getOtpDto.mobile_phone}`,
      hashed_code,
      ttl,
    );

    return { hashed_code };
  }

  async getEmailOtp(getOtpDto: GetEmailOtpDto) {
    const otp = this.generateOtpCode();
    const data_string = JSON.stringify({ email: getOtpDto.email, otp });

    const hashed_code = await AuthCommon.createHash(data_string);

    // TODO
    // Send OTP code via Email service
    console.log({ otp });

    // Store OTP and Hashed_code in Redis with a TTL
    const ttl = this.configService.get('OTP_EMAIL_EXPIRATION');
    const cache_prefix = this.configService.getOrThrow<string>(
      'REDIS_CACHE_KEY_PREFIX_AUTH',
    );
    await this.cacheManager.set(
      `${cache_prefix}:${getOtpDto.email}`,
      hashed_code,
      ttl,
    );

    return { hashed_code };
  }

  async confirmMobilePhoneOtp(
    confirmOtpDto: ConfirmMobilePhoneOtpDto,
    response: Response,
  ) {
    // Retereve hashed_code from Redis
    const cache_prefix = this.configService.getOrThrow<string>(
      'REDIS_CACHE_KEY_PREFIX_AUTH',
    );
    const hashed_code = await this.cacheManager.get(
      `${cache_prefix}:${confirmOtpDto.mobile_phone}`,
    );

    if (!hashed_code || hashed_code !== confirmOtpDto.hashed_code) {
      throw new UnauthorizedException(
        'OTP has already been used or is invalid',
      );
    }

    const data_string = JSON.stringify({
      mobile_phone: confirmOtpDto.mobile_phone,
      otp: confirmOtpDto.confirmation_code,
    });

    const isEqual = await AuthCommon.compareHash(
      confirmOtpDto.hashed_code,
      data_string,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    let user = await this.usersService.findOneNoCheck({
      mobile_phone: confirmOtpDto.mobile_phone,
    });

    // user is not already registered
    if (!user) {
      // new user
      const access_id = this.configService.get('DEFAULT_ACCESS_ID');
      const default_first_name = this.configService.get<string>(
        'DEFAULT_USER_FIRST_NAME',
      );
      const default_last_name = this.configService.get<string>(
        'DEFAULT_USER_LAST_NAME',
      );

      const mobile_phone = confirmOtpDto.mobile_phone;
      const mobile_phone_is_verified = true;
      const first_name = confirmOtpDto.first_name || default_first_name;
      const last_name = confirmOtpDto.last_name || default_last_name;
      const avatar = confirmOtpDto.avatar;
      const password = confirmOtpDto?.password
        ? confirmOtpDto.password
        : this.generateStrongPassword();
      const created_by_system = false;
      const need_to_set_name =
        first_name === default_first_name && last_name === default_last_name;
      const access_ids = [access_id];

      user = await this.usersService.propareNewUser({
        mobile_phone,
        mobile_phone_is_verified,
        first_name,
        last_name,
        avatar,
        password,
        created_by_system,
        need_to_set_name,
        access_ids,
      });
    }
    // verify the mobile phone
    else if (!user?.mobile_phone_is_verified) {
      user = await this.usersService.updateMobilePhoneVerificationStatus(
        user.id,
        true,
      );
    }

    // Mark OTP as used by deleting it from Redis
    await this.cacheManager.del(
      `${cache_prefix}:${confirmOtpDto.mobile_phone}`,
    );

    await this.authenticate(user, response);

    return user;
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    response: Response,
    user: User,
  ) {
    // Retereve hashed_code from Redis
    const cache_prefix = this.configService.getOrThrow<string>(
      'REDIS_CACHE_KEY_PREFIX_AUTH',
    );
    const hashed_code = await this.cacheManager.get(
      `${cache_prefix}:${user.mobile_phone}`,
    );

    if (!hashed_code || hashed_code !== changePasswordDto.hashed_code) {
      throw new UnauthorizedException(
        'OTP has already been used or is invalid',
      );
    }

    const data_string = JSON.stringify({
      mobile_phone: user.mobile_phone,
      otp: changePasswordDto.confirmation_code,
    });

    const isEqual = await AuthCommon.compareHash(
      changePasswordDto.hashed_code,
      data_string,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    // update password
    await this.usersService.updatePassword(user.id, changePasswordDto.password);

    // Mark OTP as used by deleting it from Redis
    await this.cacheManager.del(`${cache_prefix}:${user.mobile_phone}`);

    await this.authenticate(user, response);

    return user;
  }

  async changeEmail(
    confirmOtpDto: ChangeEmailDto,
    response: Response,
    user: User,
  ) {
    // Retereve hashed_code from Redis
    const cache_prefix = this.configService.getOrThrow<string>(
      'REDIS_CACHE_KEY_PREFIX_AUTH',
    );
    const hashed_code = await this.cacheManager.get(
      `${cache_prefix}:${confirmOtpDto.email}`,
    );

    if (!hashed_code || hashed_code !== confirmOtpDto.hashed_code) {
      throw new UnauthorizedException(
        'OTP has already been used or is invalid',
      );
    }

    const data_string = JSON.stringify({
      email: confirmOtpDto.email,
      otp: confirmOtpDto.confirmation_code,
    });

    const isEqual = await AuthCommon.compareHash(
      confirmOtpDto.hashed_code,
      data_string,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    // update or add email
    const userUpdated = await this.usersService.updateEmail(
      user.id,
      confirmOtpDto.email,
    );

    // Mark OTP as used by deleting it from Redis
    await this.cacheManager.del(`${cache_prefix}:${confirmOtpDto.email}`);

    await this.authenticate(user, response);

    return userUpdated;
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.usersService.findOneNoCheck({
      mobile_phone: loginDto.mobile_phone,
    });

    const isEqual = await AuthCommon.compareHash(
      user.hashed_password,
      loginDto.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    await this.authenticate(user, response);

    return user;

    // return {
    //   authentication,
    //   user,
    // };
  }

  async logout(response: Response) {
    return this.unauthenticate(response);
  }

  async verifyUser(mobile_phone: string, password: string) {
    const user = await this.usersService.findOne({ mobile_phone });

    const isEqual = await AuthCommon.compareHash(
      user.hashed_password,
      password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  async editInfo(editInfoDto: EditInfoDto, user: User) {
    const updatedUser = await this.usersService.update(user.id, editInfoDto);

    return updatedUser;
  }

  private generateOtpCode(): number {
    // Generate 3 random bytes and convert them to a 5-digit number
    const buffer = randomBytes(3);
    const otp = buffer.readUIntBE(0, 3) % 100000;

    // Pad the OTP with leading zeros if necessary
    return +otp.toString().padStart(5, '1');
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

  private async authenticate(user: User, response: Response): Promise<string> {
    const secure = this.configService.get('COOKIE_CONFIG_SECURE');
    const sameSite = this.configService.get('COOKIE_CONFIG_SAME_SITE');
    const domain = this.configService.get('COOKIE_CONFIG_DOMAIN');

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const expiration_in_seconds = this.configService.get('JWT_EXPIRATION');
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + expiration_in_seconds);

    const token = this.jwtService.sign(tokenPayload);

    const config: CookieOptions = {
      httpOnly: true,
      secure,
      expires,
      maxAge: expiration_in_seconds * 1000,
      path: '/',
    };

    if (sameSite !== 'default') config.sameSite = sameSite;
    if (domain !== 'default') config.domain = domain;

    response.cookie('Authentication', token, config);

    return token;
  }

  private async unauthenticate(response: Response): Promise<string> {
    const secure = this.configService.get('COOKIE_CONFIG_SECURE');
    const sameSite = this.configService.get('COOKIE_CONFIG_SAME_SITE');
    const domain = this.configService.get('COOKIE_CONFIG_DOMAIN');

    const config: CookieOptions = {
      httpOnly: true,
      secure,
      expires: new Date(),
      maxAge: 0,
      path: '/',
    };

    if (sameSite !== 'default') config.sameSite = sameSite;
    if (domain !== 'default') config.domain = domain;

    response.cookie('Authentication', '', config);

    return null;
  }
}

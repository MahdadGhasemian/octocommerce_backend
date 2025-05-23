import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  CurrentUser,
  EVENT_NAME_AUTHENTICATE,
  FoceToClearCache,
  MessageAckInterceptor,
  NoCache,
} from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { GetOtpResponseDto } from './dto/get-otp.response.dto';
import { GetUserDto } from './users/dto/get-user.dto';
import { Serialize } from './users/interceptors/serialize.interceptor';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetMobilePhoneOtpDto } from './dto/get-mobile-phone-otp.dto';
import { GetEmailOtpDto } from './dto/get-email-otp.dto';
import { ConfirmMobilePhoneOtpDto } from './dto/confirm-mobile-phone-otp.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '@app/auth';
import { EditInfoDto } from './dto/edit-info.dto';

@ApiTags('Auth')
@NoCache()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('otp/mobile_phone')
  @ApiCreatedResponse({
    type: GetOtpResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getMobilePhoneOtp(@Body() body: GetMobilePhoneOtpDto) {
    return this.authService.getMobilePhoneOtp(body);
  }

  @Post('otp/email')
  @ApiCreatedResponse({
    type: GetOtpResponseDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getEmailOtp(@Body() body: GetEmailOtpDto) {
    return this.authService.getEmailOtp(body);
  }

  @Post('otp/confirm/mobile_phone')
  @FoceToClearCache('/users')
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async confirmMobilePhoneOtp(
    @Body() body: ConfirmMobilePhoneOtpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.confirmMobilePhoneOtp(body, response);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async changePassowrd(
    @CurrentUser() user: User,
    @Body() body: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.changePassword(body, response, user);
  }

  @Patch('change-email')
  @UseGuards(JwtAuthGuard)
  @FoceToClearCache('/users')
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async changeEmail(
    @CurrentUser() user: User,
    @Body() body: ChangeEmailDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.changeEmail(body, response, user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, response);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  @FoceToClearCache('/users')
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Patch('info')
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  @ApiOkResponse({
    type: GetUserDto,
  })
  async editInfo(@CurrentUser() user: User, @Body() editInfoDto: EditInfoDto) {
    return this.authService.editInfo(editInfoDto, user);
  }

  @MessagePattern(EVENT_NAME_AUTHENTICATE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MessageAckInterceptor)
  async authenticate(@Payload() data: Partial<{ user: GetUserDto }>) {
    return data.user;
  }
}

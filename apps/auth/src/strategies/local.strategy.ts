import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'mobile_phone' });
  }

  async validate(mobile_phone: string, password: string) {
    try {
      return this.authService.verifyUser(mobile_phone, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}

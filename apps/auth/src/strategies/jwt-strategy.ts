import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers.authentication ||
          this.fetchAuthentication(request?.handshake?.headers?.cookie),
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  fetchAuthentication(cookieString) {
    if (!cookieString) return undefined;
    const match = cookieString.match(/Authentication=([^;]+)/);
    return match ? match[1] : undefined;
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ id: userId });
  }
}

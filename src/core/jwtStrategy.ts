import { Injectable } from '@nestjs/common';
import * as getConfig from 'config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getConfig.jwt.secret,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}

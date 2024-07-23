import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as getConfig from 'config';
import { JwtStrategy } from '../core/jwtStrategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: getConfig.jwt.secret,
      signOptions: {
        expiresIn: getConfig.jwt.expire,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}

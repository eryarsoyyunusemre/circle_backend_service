import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../core/jwtStrategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class UsersModule {}

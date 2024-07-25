import { Module } from '@nestjs/common';
import { CircleService } from './circle.service';
import { CircleController } from './circle.controller';
import { JwtStrategy } from '../core/jwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CircleController],
  providers: [CircleService, JwtStrategy, UsersService],
})
export class CircleModule {}

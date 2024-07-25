import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersEntity } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}
  async makeToken(user: UsersEntity) {
    if (user.status === 0) {
      throw new UnauthorizedException('User is inactive!');
    }

    const payload = {
      uuid: user.uuid,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      role: user.role,
      status: user.status,
      user_wallet_id: user.user_wallet_id,
      user_wallet_address: user.user_wallet_address,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      ...payload,
    };
  }

  async login(data: LoginDto) {
    try {
      const { username, password } = data;
      const getUser = await this.usersRepository.findOne({
        where: {
          username,
        },
      });

      if (!getUser && bcrypt.compare(password, password)) {
        throw new InternalServerErrorException(
          'Kullanıcı veya şifre hatalıdır!',
        );
      }

      return await this.makeToken(getUser);
    } catch (error) {
      throw error;
    }
  }
}

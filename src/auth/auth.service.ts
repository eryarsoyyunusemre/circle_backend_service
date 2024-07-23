import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersEntity } from '../users/users.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
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
      user_challenge_id: user.user_challenge_id,
      user_token: user.user_token,
      user_wallet_id: user.user_wallet_id,
      user_wallet_address: user.user_wallet_address,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      ...payload,
    };
  }
}

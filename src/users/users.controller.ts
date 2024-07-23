import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../core/guards/roles_guard';
import { RoleEnum } from './enum/enum';
import { GetUser, Level } from '../core/decarators/decarators';
import { JwtPayload } from 'src/core/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard(), RolesGuard)
  @Level(RoleEnum.ADMIN)
  @Get()
  async getAllUsers(@GetUser() user: JwtPayload) {
    return await this.usersService.getAllUser();
  }

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return await this.usersService.createUser(data).then(() => ({
      message: 'Kullanıcı başarıyla oluşturulmuştur!',
    }));
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async getAllUser() {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async getUser(uuid: string) {
    try {
      return await this.usersRepository.findOne({
        where: {
          uuid,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async createUser(data: CreateUserDto) {
    try {
      const getUser = await this.usersRepository.findOne({
        where: {
          username: data.username,
        },
      });

      if (getUser) {
        throw new InternalServerErrorException(
          `Kullanıcı adı: ${data.username} zaten kullanımda`,
        );
      }
      return await this.usersRepository.save(data.toEntity());
    } catch (error) {
      throw error;
    }
  }
}

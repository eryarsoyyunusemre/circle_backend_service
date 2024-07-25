import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, updateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async getAllUser() {
    try {
      const getUser = await this.usersRepository.find();

      // Kullanıcıların şifre değerinin dönmemesi için siliyoruz
      getUser.map((data) => {
        delete data.password;
      });

      return getUser;
    } catch (error) {
      throw error;
    }
  }

  async getUser(uuid: string) {
    try {
      const getUser = await this.usersRepository.findOne({
        where: {
          uuid,
        },
      });

      if (!getUser) {
        throw new InternalServerErrorException(
          'Bu idye sahip kullanıcı bulunamadı!',
        );
      }

      // Kullanıcıların şifre değerinin dönmemesi için siliyoruz
      delete getUser?.password;

      return getUser;
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

  async updateUser(uuid: string, data: updateUserDto) {
    try {
      // Kullanıcı varmı diye sorguluyoruz!
      await this.getUser(uuid);

      return await this.usersRepository.update({ uuid }, data.toEntity());
    } catch (error) {
      throw error;
    }
  }

  async deletUser(uuid: string) {
    try {
      // Kullanıcı varmı diye sorguluyoruz!
      await this.getUser(uuid);

      return await this.usersRepository.softDelete({
        uuid,
      });
    } catch (error) {
      throw error;
    }
  }
}

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from '../enum/enum';
import { UsersEntity } from '../users.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Type } from 'class-transformer';

export class CreateUserDto {
  uuid: string;
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsOptional()
  @IsNumber()
  status?: number = 1;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum = RoleEnum.USER;

  toEntity(): UsersEntity {
    const entity = new UsersEntity();
    entity.uuid = uuidv4();
    entity.username = this.username;
    entity.password = bcrypt.hashSync(this.password, 10);
    entity.name = this.name;
    entity.lastname = this.lastname;
    entity.status = this.status;
    entity.role = this.role;
    return entity;
  }
}

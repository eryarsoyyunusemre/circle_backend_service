import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from '../enum/enum';
import { UsersEntity } from '../users.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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

  @IsOptional()
  @IsString()
  user_wallet_id: string;

  @IsOptional()
  @IsString()
  user_wallet_address: string;
  toEntity(): UsersEntity {
    const entity = new UsersEntity();
    entity.uuid = uuidv4();
    entity.username = this.username;
    entity.password = bcrypt.hashSync(this.password, 10);
    entity.name = this.name;
    entity.lastname = this.lastname;
    entity.status = this.status;
    entity.role = this.role;
    entity.user_wallet_id = this.user_wallet_id;
    entity.user_wallet_address = this.user_wallet_address;
    return entity;
  }
}

export class updateUserDto {
  @IsOptional()
  uuid: string;
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsNumber()
  status?: number = 1;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum = RoleEnum.USER;

  @IsOptional()
  @IsString()
  user_wallet_id: string;

  @IsOptional()
  @IsString()
  user_wallet_address: string;
  toEntity(): UsersEntity {
    const entity = new UsersEntity();
    entity.username = this.username;
    if (this.password) {
      entity.password = bcrypt.hashSync(this?.password, 10);
    }
    entity.name = this.name;
    entity.lastname = this.lastname;
    entity.status = this.status;
    entity.role = this.role;
    entity.user_wallet_id = this.user_wallet_id;
    entity.user_wallet_address = this.user_wallet_address;
    return entity;
  }
}

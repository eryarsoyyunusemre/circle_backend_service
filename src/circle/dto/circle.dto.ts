import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TokenTypeEnum } from '../enum/enum';
import { Type } from 'class-transformer';
import { TransferEntity } from '../transfer.entity';
import { UsersEntity } from '../../users/users.entity';

export class TransferTokenDto {
  transferId: string;
  @IsString()
  senderUuid: string;
  @IsString()
  recieveUuid: string;
  @IsEnum(TokenTypeEnum)
  type: TokenTypeEnum;
  @IsNumber()
  @Type(() => Number)
  amount: number;

  toEntity(): TransferEntity {
    const entity = new TransferEntity();
    entity.transferId = this.transferId;
    entity.senderUuid = new UsersEntity();
    entity.senderUuid.uuid = this.senderUuid;
    entity.recieveUuid = new UsersEntity();
    entity.recieveUuid.uuid = this.recieveUuid;
    entity.tokenType = this.type;
    entity.amount = this.amount;
    return entity;
  }
}

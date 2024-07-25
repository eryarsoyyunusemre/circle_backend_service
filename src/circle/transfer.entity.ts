import { UsersEntity } from '../users/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TokenTypeEnum } from './enum/enum';

@Entity('transfer')
export class TransferEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  transferId: string;

  @ManyToOne((type) => UsersEntity, (user) => user.uuid, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'senderUuid',
  })
  senderUuid: UsersEntity;

  @ManyToOne((type) => UsersEntity, (user) => user.uuid, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'recieveUuid',
  })
  recieveUuid: UsersEntity;

  @Column({ type: 'varchar' })
  tokenType: TokenTypeEnum;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn()
  createdDate: Date;
}

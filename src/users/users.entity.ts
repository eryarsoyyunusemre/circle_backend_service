import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @PrimaryColumn()
  uuid: string;

  @Column({ length: 75, type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ length: 50, type: 'varchar' })
  name: string;

  @Column({ length: 50, type: 'varchar' })
  lastname: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ nullable: true, type: 'varchar' })
  user_challenge_id: string;

  @Column({ nullable: true, type: 'varchar' })
  user_wallet_id: string;

  @Column({ nullable: true, type: 'varchar' })
  user_wallet_address: string;

  @DeleteDateColumn({ nullable: true })
  deletedDate: Date;
}

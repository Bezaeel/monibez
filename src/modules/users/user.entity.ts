import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

class Bank {
  nickname: string;
  name: string;
  code: string;
  account: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  username: string; // for W2W txn

  @Column({ unique: true })
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  address?: string;

  @Column()
  dob: Date;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  bank?: Bank[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  @JoinTable()
  wallets: Wallet[];
}

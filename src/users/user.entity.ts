import { Wallet } from 'src/wallet/wallet.entity';
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

  @Column()
  address: string;

  @Column()
  dob: Date;

  @Column()
  phone_number: string;

  @Column({
    type: 'jsonb',
  })
  bank: Bank[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  @JoinTable()
  wallet: Wallet[];
}

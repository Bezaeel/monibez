import { Currency } from 'src/enums/currency.enum';
import { WalletStatus } from 'src/enums/wallet-status.enum';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletTxns } from './wallet-txns.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  balance: number;

  @Column({ unique: true, type: 'enum', enum: WalletStatus })
  currency: Currency;

  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: WalletStatus;

  @ManyToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'ownerId' })
  user: User;

  @OneToMany(() => WalletTxns, (wt) => wt.wallet)
  walletTxns: WalletTxns[];
}

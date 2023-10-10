import { Currency } from 'src/enums/currency.enum';
import { WalletStatus } from 'src/enums/wallet-status.enum';
import { User } from 'src/modules/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'decimal', default: 0.0, precision: 12, scale: 2 })
  balance: number;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'enum', enum: WalletStatus, default: WalletStatus.ACTIVE })
  status: WalletStatus;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn()
  user: User;
}

import {
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { Transactions } from './transactions.entity';

@Entity()
export class WalletTxns {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  walletId: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.walletTxns)
  @JoinTable()
  wallet: Wallet;

  @PrimaryColumn()
  txnId: number;

  @ManyToOne(() => Transactions, (txn) => txn.walletTxns)
  @JoinTable()
  txn: Transactions;
}

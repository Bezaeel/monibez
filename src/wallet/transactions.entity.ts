import { Currency } from 'src/enums/currency.enum';
import { TxnCategory } from 'src/enums/txn-category.enum';
import { TxnType } from 'src/enums/txn-type.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WalletTxns } from './wallet-txns.entity';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string; // in-house ref

  @Column()
  ext_reference: string; // 3rd-party ref

  @Column()
  amount: number;

  @Column()
  currency: Currency;

  @Column({ type: 'enum', enum: TxnType, nullable: true })
  type: TxnType;

  @Column({ type: 'enum', enum: TxnCategory, nullable: true })
  category: TxnCategory;

  @Column()
  narration: string;

  @Column({ nullable: false })
  from: number;

  @Column({ nullable: false }) // username of destination wallet
  to: number;

  @OneToMany(() => WalletTxns, (wt) => wt.txn)
  walletTxns: WalletTxns[];
}

import { Currency } from 'src/enums/currency.enum';
import { TxnCategory } from 'src/enums/txn-category.enum';
import { TxnType } from 'src/enums/txn-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Txn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string; // in-house ref

  @Column({ nullable: true })
  ext_reference?: string; // 3rd-party ref

  @Column()
  amount: number;

  @Column()
  currency: Currency;

  @Column({ type: 'enum', enum: TxnType })
  type: TxnType;

  @Column({ type: 'enum', enum: TxnCategory })
  category: TxnCategory;

  @Column()
  narration: string;

  @Column({ nullable: false })
  from: string;

  @Column({ nullable: false }) // username of destination wallet
  to: string;
}

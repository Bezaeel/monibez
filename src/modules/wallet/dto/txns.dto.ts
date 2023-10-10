import { TxnCategory } from 'src/enums/txn-category.enum';
import { TxnType } from 'src/enums/txn-type.enum';
import { Txn } from '../entities/txn.entity';
import { Currency } from 'src/enums/currency.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class WalletTxnRequestDTO {
  @ApiProperty({
    type: String,
    description: 'sender username',
  })
  @IsString()
  sender: string;

  @ApiProperty({
    type: String,
    description: 'beneficiary username',
  })
  @IsString()
  beneficiary: string;

  @ApiProperty({
    example: [Currency.NGN],
    description: 'required',
    enum: Currency,
    type: String,
    required: true,
  })
  @IsString()
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    type: Number,
    example: '12500.60',
    description: 'amount',
  })
  @Transform(({ value }) => value * 100)
  @IsNumber()
  amount: number;

  @ApiProperty({
    type: String,
    description: 'required',
  })
  @IsString()
  narration: string;

  reference: string;
  ext_reference: string;

  @ApiProperty({
    type: String,
    description: 'required',
  })
  @IsString()
  type: TxnType;

  @ApiProperty({
    type: String,
    description: 'required',
  })
  @IsString()
  category: TxnCategory;

  ToEntity() {
    const it = new Txn();
    it.amount = this.amount; // base currency
    it.category = this.category;
    it.type = TxnType.DEBIT;
    it.to = this.beneficiary;
    it.from = this.sender;
    it.narration = this.narration || `to ${this.beneficiary}`;
    it.reference = this.reference;
    it.ext_reference = this.ext_reference;
    it.currency = this.currency;

    return it;
  }

  ToBeneficiaryEntity() {
    const it = new Txn();
    it.amount = this.amount; // base currency
    it.category = this.category;
    it.type = TxnType.CREDIT;
    it.to = this.beneficiary;
    it.from = this.sender;
    it.narration = this.narration || `from ${this.sender}`;
    it.reference = this.reference;
    it.ext_reference = this.ext_reference;
    it.currency = this.currency;

    return it;
  }
}

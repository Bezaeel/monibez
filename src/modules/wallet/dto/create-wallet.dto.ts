import { ApiProperty } from '@nestjs/swagger';
import { Currency } from 'src/enums/currency.enum';
import { Wallet } from '../entities/wallet.entity';
import { IsEnum, IsString } from 'class-validator';

export class CreateWalletDTO {
  userId: number;

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

  ToEntity() {
    const it = new Wallet();
    it.userId = this.userId;
    it.currency = this.currency;
    return it;
  }
}

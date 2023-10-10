import { Currency } from 'src/enums/currency.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FundWalletRequestDTO {
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
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';
import { Txn } from './entities/txn.entity';
import PaystackProvider from '../providers/paystack.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Txn])],
  providers: [WalletService, PaystackProvider],
  controllers: [],
  exports: [WalletService],
})
export class WalletModule {}

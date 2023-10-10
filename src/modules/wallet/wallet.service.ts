import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Txn } from './entities/txn.entity';
import { Wallet } from './entities/wallet.entity';
import { WalletTxnRequestDTO } from './dto/txns.dto';
import { TxnType } from 'src/enums/txn-type.enum';
import { WalletStatus } from 'src/enums/wallet-status.enum';
import { BaseResponseModel } from 'src/models/response-model';
import { CreateWalletDTO } from './dto/create-wallet.dto';
import { ResponseStatus } from 'src/enums/response-status.enum';
import { Injectable, Logger } from '@nestjs/common';
import PaystackProvider from '../providers/paystack.provider';
import { TxnHelper } from 'src/helpers/txn';
import { TxnCategory } from 'src/enums/txn-category.enum';
import { FundWalletRequestDTO } from './dto/fund-wallet.dto';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(Txn) private txnRepo: Repository<Txn>,
    private readonly entityManager: EntityManager,
    private readonly paystackProvider: PaystackProvider,
  ) {}

  async createWallet(dto: CreateWalletDTO): Promise<BaseResponseModel<Wallet>> {
    try {
      const isExist = await this.walletRepo.findOne({
        where: { userId: dto.userId, currency: dto.currency },
      });

      if (isExist) {
        throw new Error('wallet already exist'); // move this to db constraint
      }
      await this.walletRepo.save(dto.ToEntity());
    } catch (error) {
      this.logger.fatal('');
      return new BaseResponseModel(
        ResponseStatus.ERROR,
        error.message || 'Operation failed',
        null,
      );
    }
  }

  async initiateW2WTxn(
    walletFrom: number,
    walletTo: number,
    dto: WalletTxnRequestDTO,
  ): Promise<BaseResponseModel<Wallet>> {
    try {
      // await this.entityManager.transaction
      // get wallet by currency
      const senderWallet = await this.walletRepo.findOne({
        where: { id: walletFrom, currency: dto.currency },
      });
      const beneficiaryWallet = await this.walletRepo.findOne({
        where: { id: walletTo },
      });
      dto.reference = TxnHelper.generateRef('MONI');

      if (!senderWallet) {
        throw new Error('invalid sender account details');
      }

      if (!beneficiaryWallet) {
        throw new Error('invalid beneficiary account details');
      }
      this.checkSenderCompliance(senderWallet, dto.type);

      // check balance => currency ops depends on currency type, but use 100 for most
      if (senderWallet.balance * 100 <= dto.amount) {
        throw new Error('Insufficient funds');
      }

      // update balance
      senderWallet.balance = senderWallet.balance * 100;
      senderWallet.balance = (senderWallet.balance - dto.amount) / 100;

      beneficiaryWallet.balance = beneficiaryWallet.balance * 100;
      beneficiaryWallet.balance =
        (beneficiaryWallet.balance + dto.amount) / 100;

      // use transaction
      await this.entityManager.transaction(async (em) => {
        await em.save(senderWallet);
        await em.save(beneficiaryWallet);

        await em.save(dto.ToBeneficiaryEntity());
        await em.save(dto.ToEntity());
      });

      return new BaseResponseModel(
        ResponseStatus.SUCCESS,
        'Success',
        senderWallet,
      );
    } catch (error) {
      return new BaseResponseModel(
        '88',
        error.message || 'operation failed',
        null,
      );
    }
  }

  async fundWallet(
    walletTo: number,
    dto: FundWalletRequestDTO,
  ): Promise<BaseResponseModel<Wallet>> {
    try {
      // await this.entityManager.transaction
      // get wallet by currency
      const beneficiaryWallet = await this.walletRepo.findOne({
        where: { id: walletTo },
      });

      if (!beneficiaryWallet) {
        throw new Error('invalid beneficiary account details');
      }

      const payload: Partial<WalletTxnRequestDTO> = {
        reference: TxnHelper.generateRef('MONI'),
        beneficiary: dto.beneficiary,
        currency: dto.currency,
        amount: dto.amount,
        type: TxnType.CREDIT,
        category: TxnCategory.OUTWARD,
      };

      const newPayload = await this.paystackProvider.initiate(payload);

      // update balance
      beneficiaryWallet.balance = beneficiaryWallet.balance * 100;
      beneficiaryWallet.balance =
        (beneficiaryWallet.balance + newPayload.amount) / 100;

      // use transaction
      await this.entityManager.transaction(async (em) => {
        await em.save(beneficiaryWallet);

        await em.save(newPayload);
      });

      return new BaseResponseModel(
        ResponseStatus.SUCCESS,
        'Success',
        beneficiaryWallet,
      );
    } catch (error) {
      return new BaseResponseModel(
        '88',
        error.message || 'operation failed',
        null,
      );
    }
  }

  async Txns(walletId: number) {
    try {
      const txns = await this.walletRepo.findOne({
        where: { id: walletId },
        relations: ['walletTxns'],
      });
      return new BaseResponseModel(ResponseStatus.SUCCESS, 'Success', txns);
    } catch (error) {
      return new BaseResponseModel(
        ResponseStatus.ERROR,
        error.message || 'Operation failed',
        null,
      );
    }
  }

  async checkSenderCompliance(senderWallet: Wallet, txnType: TxnType) {
    // check compliance on sender
    if (txnType == TxnType.DEBIT && senderWallet.status == WalletStatus.PND) {
      throw new Error(`wallet state is ${senderWallet.status}`);
    }
  }
}

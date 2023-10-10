import { TxnHelper } from 'src/helpers/txn';
import { WalletTxnRequestDTO } from '../wallet/dto/txns.dto';
import { Txn } from '../wallet/entities/txn.entity';
import { TxnType } from 'src/enums/txn-type.enum';

export default class PaystackProvider {
  paystackBaseUrl: string = process.env.PAYSTACK_BASE_URL;
  paystackAuthHeader = {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  };

  constructor() {}

  async initiate(dto: Partial<WalletTxnRequestDTO>): Promise<Txn> {
    dto.ext_reference = TxnHelper.generateRef('PYSTK');
    dto.sender = '1122334455';

    return this.map(dto);
  }

  map(dto: Partial<WalletTxnRequestDTO>) {
    const it = new Txn();
    it.amount = dto.amount; // base currency
    it.category = dto.category;
    it.type = TxnType.CREDIT;
    it.to = dto.beneficiary;
    it.from = dto.sender;
    it.narration = dto.narration || `from ${dto.sender}`;
    it.reference = dto.reference;
    it.ext_reference = dto.ext_reference;
    it.currency = dto.currency;

    return it;
  }
}

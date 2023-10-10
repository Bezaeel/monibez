import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import { Currency } from 'src/enums/currency.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    const entity = dto.ToEntity();
    return this.repo.save(entity);
  }

  async getWallet(username: string, currency: Currency) {
    try {
      const user = await this.repo.findOne({
        where: { username: username },
        relations: { wallets: true },
      });

      if (user == null) {
        throw new Error('invalid account details');
      }

      const wallet = user.wallets.filter((c) => {
        return c.currency == currency;
      })[0];

      if (wallet == null) {
        throw new Error('invalid currency txn');
      }

      return wallet.id;
    } catch (error) {}
  }
}

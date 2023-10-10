import { Controller, Post, Body, Inject, Param, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { WalletTxnRequestDTO } from '../wallet/dto/txns.dto';
import { WalletService } from '../wallet/wallet.service';
import { CreateWalletDTO } from '../wallet/dto/create-wallet.dto';
import { FundWalletRequestDTO } from '../wallet/dto/fund-wallet.dto';

@ApiTags('User')
@Controller('User')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(WalletService) private walletService: WalletService,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async createUser(@Body() dto: CreateUserDTO): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Post('/:id/add-wallet')
  @ApiCreatedResponse({ description: 'Success' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async AddWallet(
    @Param('id') id: number,
    @Body() dto: CreateWalletDTO,
  ): Promise<any> {
    dto.userId = id;
    return this.walletService.createWallet(dto);
  }

  @Post('/transfer')
  @ApiCreatedResponse({ description: 'Success' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async Send(@Body() dto: WalletTxnRequestDTO): Promise<any> {
    const walletFrom = await this.userService.getWallet(
      dto.sender,
      dto.currency,
    );
    const walletTo = await this.userService.getWallet(
      dto.beneficiary,
      dto.currency,
    );
    return this.walletService.initiateW2WTxn(walletFrom, walletTo, dto);
  }

  @Post('/fund')
  @ApiCreatedResponse({ description: 'Success' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async FundWallet(@Body() dto: FundWalletRequestDTO): Promise<any> {
    const walletTo = await this.userService.getWallet(
      dto.beneficiary,
      dto.currency,
    );
    return this.walletService.fundWallet(walletTo, dto);
  }
}

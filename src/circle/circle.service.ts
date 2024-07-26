import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as config from 'config';
import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { updateUserDto } from '../users/dto/users.dto';
import { UsersService } from '../users/users.service';
import { TokenTypeEnum } from './enum/enum';
import { TransferTokenDto } from './dto/circle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferEntity } from './transfer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CircleService {
  private circleDeveloperSdk;

  constructor(
    @InjectRepository(TransferEntity)
    private readonly transferRepository: Repository<TransferEntity>,
    private readonly usersService: UsersService,
  ) {
    this.circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
      apiKey: config.circle.apiKey,
      entitySecret: config.circle.ENTITY_SECRET,
    });
  }

  async createWallet(uuid: string): Promise<void> {
    try {
      const getUserWallet = await this.usersService.getUser(uuid);

      if (getUserWallet.user_wallet_id && getUserWallet.user_wallet_address) {
        throw new InternalServerErrorException(
          'Kullanıcızın cüzdanı zaten vardır!',
        );
      }
      const response = await this.circleDeveloperSdk.createWallets({
        accountType: 'SCA',
        blockchains: ['MATIC-AMOY'],
        count: 1,
        walletSetId: config.circle.WALLET_SET_ID,
      });

      const dto = new updateUserDto();
      dto.user_wallet_id = response.data.wallets[0].id;
      dto.user_wallet_address = response.data.wallets[0].address;

      await this.usersService.updateUser(uuid, dto);
    } catch (error) {
      throw error;
    }
  }

  async getWallets() {
    try {
      const res = await this.circleDeveloperSdk.listWallets({
        walletSetId: config.circle.WALLET_SET_ID,
      });

      return res.data.wallets;
    } catch (error) {
      throw error;
    }
  }

  async getWallet(uuid: string): Promise<void> {
    try {
      const getUserWallet = await this.usersService.getUser(uuid);

      if (!getUserWallet.user_wallet_id && !getUserWallet.user_wallet_address) {
        throw new InternalServerErrorException(
          'Kullanıcızın hesabı yoktur lütfen oluşturunuz!',
        );
      }
      const res = await this.circleDeveloperSdk.getWallet({
        id: getUserWallet.user_wallet_id,
      });

      return res.data.wallet;
    } catch (error) {
      throw error;
    }
  }

  async walletTransactions(walletIds: string) {
    try {
      const response = await this.circleDeveloperSdk.listTransactions({
        walletIds: [walletIds],
      });

      return response.data.transactions;
    } catch (error) {
      throw error;
    }
  }

  async getBalance(uuid: string, type?: TokenTypeEnum) {
    try {
      const getUserWallet = await this.usersService.getUser(uuid);

      if (!getUserWallet.user_wallet_id && !getUserWallet.user_wallet_address) {
        throw new InternalServerErrorException(
          'Kullanıcızın hesabı yoktur lütfen oluşturunuz!',
        );
      }
      const res = await this.circleDeveloperSdk.getWalletTokenBalance({
        id: getUserWallet.user_wallet_id,
      });

      if (type != null) {
        const token = res.data.tokenBalances.find(
          (item) => item.token.symbol === type,
        );
        return token ?? null;
      }

      return res.data.tokenBalances;
    } catch (error) {
      throw error;
    }
  }

  async transferToken(data: TransferTokenDto) {
    try {
      const { senderUuid, recieveUuid, type, amount } = data;
      const senderDetails = await this.usersService.getUser(senderUuid);
      const recieveDetails = await this.usersService.getUser(recieveUuid);
      const getSenderTokenId = await this.getBalance(senderUuid, type);
      const res = await this.circleDeveloperSdk.createTransaction({
        walletId: senderDetails.user_wallet_id,
        tokenId: getSenderTokenId.token.id,
        destinationAddress: recieveDetails.user_wallet_address,
        amounts: [`${amount}`],
        fee: {
          type: 'level',
          config: {
            feeLevel: 'MEDIUM',
          },
        },
      });

      const dto = new TransferTokenDto();
      dto.transferId = res.data.id;
      dto.senderUuid = senderDetails.uuid;
      dto.recieveUuid = recieveDetails.uuid;
      dto.amount = amount;
      dto.type = type;

      await this.transferRepository.save(dto.toEntity());
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  //TODO: Zaten frontend buradaki idye erişecği için  direkt işlemin idsi ile işlem yapabilecek!!
  async checkTransferState(id: string): Promise<void> {
    try {
      const res = await this.circleDeveloperSdk.getTransaction({
        id: id,
      });

      return res.data.transaction;
    } catch (error) {
      throw error;
    }
  }
}

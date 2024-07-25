import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as config from 'config';
import axios from 'axios';
const circleConfig = config.get('circle');
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { updateUserDto } from '../users/dto/users.dto';

('use server');
@Injectable()
export class CircleService {
  constructor(private readonly usersService: UsersService) {}

  async createCircleUser(userId: string) {
    try {
      const response = await axios.post(
        'https://api.circle.com/v1/w3s/users',
        { userId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${circleConfig.apiKey}`,
          },
        },
      );

      // Yanıt verilerini işleme
      return {
        userId,
        status: response.data.data.status,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchUserToken(userId: string) {
    try {
      const response = await axios.post(
        'https://api.circle.com/v1/w3s/users/token',
        { userId: userId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${circleConfig.apiKey}`,
          },
        },
      );

      return {
        userToken: response.data.data.userToken,
        encryptionKey: response.data.data.encryptionKey,
      };
    } catch (error) {
      throw new Error('Veri alınırken bir hata oluştu.');
    }
  }

  // Fonksiyon: Kullanıcıyı başlatma ve challenge ID almak
  async initializeUser(userId: string) {
    const idempotencyKey = uuidv4(); // İdempotentlik anahtarını oluşturur
    const getUserToken = await this.fetchUserToken(userId);
    try {
      const options = {
        method: 'POST',
        url: 'https://api.circle.com/v1/w3s/user/initialize',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${circleConfig.apiKey}`,
          'X-User-Token': `${getUserToken.userToken}`,
        },
        data: {
          idempotencyKey: idempotencyKey,
          accountType: 'SCA',
          blockchains: ['MATIC-AMOY'],
        },
      };

      const response = await axios.request(options);
      const dto = new updateUserDto();
      dto.user_challenge_id = response.data.data.challengeId;
      await this.usersService.updateUser(userId, dto);

      return response.data.data.challengeId;
    } catch (error) {
      throw new Error(error);
    }
  }

  async transferFunds(userId, destinationAddress, amounts, tokenID, walletId) {
    const idempotencyKey = uuidv4(); // İdempotentlik anahtarını oluşturur
    const getUserToken = await this.fetchUserToken(userId);
    try {
      const response = await axios.post(
        'https://api.circle.com/v1/w3s/user/transactions/transfer',
        {
          idempotencyKey,
          userId: userId,
          destinationAddress: destinationAddress,
          refId: 'Circle Course Deneme',
          amounts: [`${amounts}`],
          feeLevel: 'HIGH',
          tokenId: tokenID,
          walletId: walletId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${circleConfig.apiKey}`,
            'X-User-Token': getUserToken.userToken,
          },
        },
      );

      return response.data; // Yanıt verisini döndür
    } catch (error) {
      // Hata durumunda hata mesajı döndür
      console.error('API isteği sırasında bir hata oluştu:', error.message);
      throw new Error('Para transferi sırasında bir hata oluştu.');
    }
  }

  async getWallet(userId: string) {
    try {
      const getUserToken = await this.fetchUserToken(userId);
      const options = {
        method: 'GET',
        url: 'https://api.circle.com/v1/w3s/wallets?pageSize=10',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${circleConfig.apiKey}`,
          'X-User-Token': `${getUserToken.userToken}`,
        },
      };

      return await axios.request(options).then((res) => {
        res.data.data;
      });
    } catch (error) {
      throw error;
    }
  }
}

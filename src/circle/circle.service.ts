import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as config from 'config';
import axios from 'axios';
const circleConfig = config.get('circle');

@Injectable()
export class CircleService {
  async createCircleUser(userId: number) {
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
}

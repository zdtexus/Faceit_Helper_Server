import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import API_CONFIG from 'config/apiConfig';
import { getFaceitAuthHeaders } from 'config/config';

@Injectable()
export class RankingService {
  async ranking(
    region: string = 'EU',
    country: string = '',
    rank: number = 0,
  ): Promise<any> {
    try {
      const limit = 40;
      let offset = rank;

      if (offset % limit !== 0) {
        offset = Math.floor(offset / limit) * limit;
      }

      const rankingUrl: string = API_CONFIG.countryRankingUrl(
        region,
        country,
        limit,
        offset,
      );

      const headers = getFaceitAuthHeaders();

      const response = await axios.get(rankingUrl, { headers });

      return response.data;
    } catch (error) {
      console.error('Error in ranking:', {
        message: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        'Failed to fetch player rankings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

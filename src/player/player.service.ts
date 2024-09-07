import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import API_CONFIG from 'config/apiConfig';
import { getFaceitAuthHeaders } from 'config/config';

@Injectable()
export class PlayerService {
  async playerMatches(
    playerId: string,
    offset: number = 0,
    limit: number = 100,
  ): Promise<any> {
    try {
      const adjustedOffset = offset !== 0 ? offset * 100 : offset;

      const [response, newResponse] = await Promise.all([
        axios.get(API_CONFIG.playerMatchesUrl(playerId, offset, limit)),
        axios.get(
          API_CONFIG.newPlayerMatchesUrl(playerId, adjustedOffset, limit),
          {
            headers: getFaceitAuthHeaders(),
          },
        ),
      ]);

      const formattedData = response.data
        .map((match: any) => {
          // Найти соответствующий матч в новом API
          const newMatch = newResponse.data.items.find(
            (item: any) => item.stats['Match Id'] === match.matchId,
          );

          if (newMatch) {
            return {
              elo: match.elo,
              matchId: newMatch.stats['Match Id'],
              result: newMatch.stats['Result'],
              mvps: newMatch.stats['MVPs'],
              secondHalfScore: newMatch.stats['Second Half Score'],
              kills: newMatch.stats['Kills'],
              deaths: newMatch.stats['Deaths'],
              assists: newMatch.stats['Assists'],
              kdRatio: newMatch.stats['K/D Ratio'],
              krRatio: newMatch.stats['K/R Ratio'],
              hsPercent: newMatch.stats['Headshots %'],
              hs: newMatch.stats['Headshots'],
              adr: newMatch.stats['ADR'],
              team: newMatch.stats['Team'].startsWith('team_')
                ? newMatch.stats['Team'].slice(5)
                : newMatch.stats['Team'],
              map: newMatch.stats['Map'].startsWith('de_')
                ? newMatch.stats['Map'].slice(3)
                : newMatch.stats['Map'],
              score: newMatch.stats['Score'],
              rounds: newMatch.stats['Rounds'],
              mode: newMatch.stats['Game Mode'],
              triples: newMatch.stats['Triple Kills'],
              quadros: newMatch.stats['Quadro Kills'],
              pentas: newMatch.stats['Penta Kills'],
              date: new Date(newMatch.stats['Created At']).toISOString(),
            };
          }

          return null;
        })
        .filter((match: any) => match !== null);

      return formattedData;
    } catch (error) {
      console.error('Error in playerMatches:', {
        message: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        'Failed to fetch player matches',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async playerMaps(playerId: string): Promise<any> {
    try {
      const playerMapsUrl = API_CONFIG.playerFullStatsUrl(playerId);
      const headers = getFaceitAuthHeaders();
      const response = await axios.get(playerMapsUrl, { headers });

      const segments = response.data.segments || [];
      const formattedSegments = segments.map((segment) => ({
        mode: segment.mode,
        label: segment.label,
        img: segment.img_small,
        stats: segment.stats,
      }));

      return formattedSegments;
    } catch (error) {
      console.error('Error in playerMaps:', {
        message: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        'Failed to fetch player maps',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async playerBans(playerId: string): Promise<any> {
    try {
      const playerBansUrl = API_CONFIG.playerBansUrl(playerId);
      const response = await axios.get(playerBansUrl);

      const payload = response.data.payload || [];
      const formattedPayload = payload.map((payload) => ({
        expired: String(payload.expired),
        nickname: payload.nickname,
        reason: payload.reason,
        banStart: payload.banStart,
        banEnd: payload.banEnd,
        lastModified: payload.lastModified,
      }));

      return formattedPayload;
    } catch (error) {
      console.error('Error in playerBans:', {
        message: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        'Failed to fetch player bans',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

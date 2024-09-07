import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import API_CONFIG from 'config/apiConfig';
import { getFaceitAuthHeaders } from 'config/config';
import { STEAM_API_KEY } from 'config/config';

@Injectable()
export class SearchService {
  private getSteamVanityUrl(url: string): string {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/');
    return pathParts[pathParts.length - 2];
  }

  private getSteamId64FromProfileUrl(profileUrl: string): string {
    const parsedUrl = new URL(profileUrl);
    const pathParts = parsedUrl.pathname.split('/');
    return pathParts[pathParts.length - 1];
  }

  private async searchFaceitNickname(nickname: string): Promise<string> {
    const url = API_CONFIG.playerByNicknameUrl(nickname);
    const headers = getFaceitAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      const steamId64 = response.data.steam_id_64;

      if (steamId64) {
        return steamId64;
      } else {
        throw new Error('No SteamID64 found for the Faceit nickname');
      }
    } catch (error) {
      console.error('Error fetching SteamID64 from Faceit:', error.message);
      throw new HttpException(
        'Failed to fetch SteamID64 from Faceit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getSteamId64FromVanityUrl(vanityUrl: string): Promise<string> {
    const url = API_CONFIG.steamId64ByVanityUrl();
    const params = {
      key: STEAM_API_KEY,
      vanityUrl: vanityUrl,
    };

    try {
      const response = await axios.get(url, { params });
      if (response.data.response.success === 1) {
        return response.data.response.steamid;
      } else {
        throw new Error('Failed to resolve vanity URL');
      }
    } catch (error) {
      console.error('Error fetching SteamID64 from vanity URL:', error.message);
      throw new HttpException(
        'Failed to fetch SteamID64 from vanity URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async searchFaceitBySteamId64(steamId64: string): Promise<any> {
    const url = API_CONFIG.playerBySteamId64Url(steamId64);
    const headers = getFaceitAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching player data from Faceit:', error.message);
      throw new HttpException(
        'Failed to fetch player data from Faceit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async searchPlayerList(nickname: string): Promise<any> {
    const url = API_CONFIG.playerListUrl(nickname);
    const headers = getFaceitAuthHeaders();

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching player list from Faceit:', error.message);
      throw new HttpException(
        'Failed to fetch player list from Faceit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  formatPlayerInfo(playerInfo: any): any {
    return {
      nickname: playerInfo.nickname || 'N/A',
      description: playerInfo.games?.cs2?.game_player_name || 'N/A',
      playerFaceitId: playerInfo.player_id || 'N/A',
      steamId64: playerInfo.steam_id_64 || 'N/A',
      region: playerInfo.games?.cs2?.region || 'N/A',
      country: playerInfo.country?.toUpperCase() || 'N/A',
      regionRank: 'N/A',
      countryRank: 'N/A',
      skillLevel: playerInfo.games?.cs2?.skill_level || 'N/A',
      elo: playerInfo.games?.cs2?.faceit_elo || 'N/A',
      avatarUrl: playerInfo.avatar || null,
      faceitUrl: playerInfo.faceit_url?.replace('{lang}', 'en') || 'N/A',
      steamUrl: API_CONFIG.playerSteamUrl(playerInfo?.steam_id_64) || 'N/A',
      activatedAt: playerInfo.activated_at || 'N/A',
      memberships: playerInfo?.memberships || 'N/A',
    };
  }

  private formatPlayerList(playerList: any): any {
    return playerList.items
      .filter((player: any) =>
        player.games.some((game: any) => game.name === 'cs2'),
      )
      .map((player: any) => {
        const cs2Game = player.games.find((game: any) => game.name === 'cs2');
        return {
          nickname: player.nickname,
          playerFaceitId: player.player_id,
          skillLevel: cs2Game ? cs2Game.skill_level : '',
          country: player.country || 'N/A',
          avatarUrl: player.avatar || null,
        };
      });
  }

  private determineInputType(searchValue: string): string {
    if (/^\d{17}$/.test(searchValue)) {
      return 'steamid64';
    } else if (
      /^https?:\/\/steamcommunity\.com\/id\/[a-zA-Z0-9_-]+\/?$/.test(
        searchValue,
      )
    ) {
      return 'steam_url';
    } else if (
      /^https?:\/\/steamcommunity\.com\/profiles\/\d{17}\/?$/.test(searchValue)
    ) {
      return 'steam_profile_url';
    } else if (
      /^https?:\/\/www\.faceit\.com\/[a-z]{2}\/players\/[a-zA-Z0-9_-]+\/?$/.test(
        searchValue,
      )
    ) {
      return 'faceit_url';
    } else {
      return 'faceit_nickname';
    }
  }

  async searchPlayerByRankForRanking(rank: number): Promise<any> {
    try {
      const region = 'EU';
      const limit = 40;

      const offset = rank <= limit ? 0 : Math.floor((rank - 1) / limit) * limit;

      const findPlayerByRankForRanking = API_CONFIG.globalRankingUrl(
        region,
        limit,
        offset,
      );
      const headers = getFaceitAuthHeaders();

      const response = await axios.get(findPlayerByRankForRanking, { headers });

      return {
        response: response.data, // Return only necessary data
      };
    } catch (error) {
      console.error('Error in searchPlayerByRankForRanking:', {
        message: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        'Failed to fetch player rankings by rank',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchPlayerByNicknameForRankings(nickname: string): Promise<any> {
    try {
      const playerInfo = await this.searchPlayer(nickname);

      if (!playerInfo) {
        throw new Error('Incomplete player information');
      }

      const regionRank = playerInfo.regionRank;
      const region = playerInfo.region;

      const limit = 40;
      const offset = regionRank
        ? Math.floor((regionRank - 1) / limit) * limit
        : 0;

      const globalRankingUrl = API_CONFIG.globalRankingUrl(
        region,
        limit,
        offset,
      );
      const headers = getFaceitAuthHeaders();

      const response = await axios.get(globalRankingUrl, { headers });

      return {
        response: response.data,
      };
    } catch (error) {
      console.error('Error in findPlayerByNicknameForRankings:', {
        message: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        'Failed to fetch player rankings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getPlayerRankings(
    region: string,
    playerId: string,
    country: string,
  ): Promise<{ globalRank: number | null; countryRank: number | null }> {
    const headers = getFaceitAuthHeaders();
    const getGlobalRankUrl = API_CONFIG.playerGlobalRankUrl(region, playerId);
    const getCountryRankUrl = API_CONFIG.playerCountryRankUrl(
      region,
      playerId,
      country,
    );

    try {
      const [globalRankResponse, countryRankResponse] = await Promise.all([
        axios.get(getGlobalRankUrl, { headers }),
        axios.get(getCountryRankUrl, { headers }),
      ]);

      const globalRankData = globalRankResponse.data;
      const countryRankData = countryRankResponse.data;

      const globalRank =
        globalRankData.items.find((item: any) => item.player_id === playerId)
          ?.position || null;
      const countryRank =
        countryRankData.items.find((item: any) => item.player_id === playerId)
          ?.position || null;

      return { globalRank, countryRank };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch player rankings',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchByValue(searchValue: string): Promise<any> {
    const inputType = this.determineInputType(searchValue);
    let steamId64;
    let result;

    try {
      switch (inputType) {
        case 'steamid64':
          steamId64 = searchValue;
          break;
        case 'steam_url':
          const vanityUrl = this.getSteamVanityUrl(searchValue);
          steamId64 = await this.getSteamId64FromVanityUrl(vanityUrl);
          break;
        case 'steam_profile_url':
          steamId64 = await this.getSteamId64FromProfileUrl(searchValue);
          break;
        case 'faceit_url':
          const nicknameFromUrl = searchValue.split('/').pop();
          steamId64 = await this.searchFaceitNickname(nicknameFromUrl);
          break;
        case 'faceit_nickname':
          steamId64 = await this.searchFaceitNickname(searchValue);
          break;
        default:
          throw new Error('Invalid search value');
      }

      if (steamId64) {
        result = await this.searchFaceitBySteamId64(steamId64);
      } else {
        throw new Error('Failed to resolve SteamID64');
      }

      return result;
    } catch (error) {
      console.error('Error in searchByValue:', error.message);

      if (inputType === 'faceit_nickname' || inputType === 'faceit_url') {
        try {
          const playerList = await this.searchPlayerList(searchValue);
          return playerList;
        } catch (listError) {
          console.error(
            'Error fetching player list from Faceit:',
            listError.message,
          );
          throw new HttpException(
            'Failed to fetch player data from Faceit',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else {
        throw new HttpException(
          'Failed to fetch player data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async searchPlayer(searchValue: string): Promise<any> {
    const playerInfo = await this.searchByValue(searchValue);

    if (playerInfo.items) {
      const formattedPlayers = this.formatPlayerList(playerInfo);
      return formattedPlayers;
    } else {
      const { globalRank, countryRank } = await this.getPlayerRankings(
        playerInfo.games.cs2.region,
        playerInfo.player_id,
        playerInfo.country,
      );

      const formattedPlayerInfo = this.formatPlayerInfo(playerInfo);
      formattedPlayerInfo.regionRank = globalRank;
      formattedPlayerInfo.countryRank = countryRank;
      return formattedPlayerInfo;
    }
  }
}

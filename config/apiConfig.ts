const V4_FACEIT_URL = 'https://open.faceit.com/data/v4';
const V1_FACEIT_URL = 'https://www.faceit.com/api';
const BASE_STEAM_URL = 'https://api.steampowered.com';

const API_CONFIG = {
  playerByNicknameUrl: (nickname: string): string =>
    `${V4_FACEIT_URL}/players?nickname=${nickname}`,
  playerBySteamId64Url: (steamid_64: string): string =>
    `${V4_FACEIT_URL}/players?game=cs2&game_player_id=${steamid_64}`,
  playerListUrl: (nickname: string): string =>
    `${V4_FACEIT_URL}/search/players?nickname=${nickname}&limit=15`,
  steamId64ByVanityUrl: (): string =>
    `${BASE_STEAM_URL}/ISteamUser/ResolveVanityURL/v0001/`,
  playerSummariesBySteamId: (): string =>
    `${BASE_STEAM_URL}/ISteamUser/GetPlayerSummaries/v0002/`,
  playerMatchesUrl: (playerId: string, offset: number, limit: number): string =>
    `${V1_FACEIT_URL}/stats/v1/stats/time/users/${playerId}/games/cs2?page=${offset}&size=${limit}`,
  newPlayerMatchesUrl: (
    playerId: string,
    offset: number,
    limit: number,
  ): string =>
    `${V4_FACEIT_URL}/players/${playerId}/games/cs2/stats?offset=${offset}&limit=${limit}`,
  playerBansUrl: (playerId: string): string =>
    `${V1_FACEIT_URL}/queue/v1/ban?userId=${playerId}&organizerId=faceit`,
  playerFullStatsUrl: (playerId: string): string =>
    `${V4_FACEIT_URL}/players/${playerId}/stats/cs2`,
  playerGlobalRankUrl: (region: string, playerId: string): string =>
    `${V4_FACEIT_URL}/rankings/games/cs2/regions/${region}/players/${playerId}`,
  playerCountryRankUrl: (
    region: string,
    playerId: string,
    country: string,
  ): string =>
    `${V4_FACEIT_URL}/rankings/games/cs2/regions/${region}/players/${playerId}?country=${country}`,
  globalRankingUrl: (region: string, limit: number, offset: number): string =>
    `${V4_FACEIT_URL}/rankings/games/cs2/regions/${region}?limit=${limit}&offset=${offset}`,
  countryRankingUrl: (
    region: string,
    country: string,
    limit: number,
    offset: number,
  ): string =>
    `${V4_FACEIT_URL}/rankings/games/cs2/regions/${region}?country=${country}&limit=${limit}&offset=${offset}`,
  playerSteamUrl: (playerId): string =>
    `https://steamcommunity.com/profiles/${playerId}`,
};

export default API_CONFIG;

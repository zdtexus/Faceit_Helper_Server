import * as dotenv from 'dotenv';

dotenv.config();

const FACEIT_API_KEY = process.env.FACEIT_API_KEY || '';
const STEAM_API_KEY = process.env.STEAM_API_KEY || '';

export const getFaceitAuthHeaders = () => ({
  Authorization: `Bearer ${FACEIT_API_KEY}`,
});

export const getSteamAuthParams = () => ({
  key: STEAM_API_KEY,
});

export { FACEIT_API_KEY, STEAM_API_KEY };

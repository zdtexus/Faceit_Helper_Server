# Faceit Helper Server

REST API that wraps the FACEIT Data API and the Steam Web API, so the client can search for CS2 players and read their stats, matches, maps, bans and rankings in one place.

Client: [Faceit_Helper_Client](https://github.com/zdtexus/Faceit_Helper_Client)

## Contents

- [Features](#features)
- [Getting started](#getting-started)
- [API reference](#api-reference)
- [Scripts](#scripts)
- [Project structure](#project-structure)

## Features

- **One search endpoint for every identifier.** It accepts a FACEIT nickname, FACEIT profile URL, SteamID64, Steam profile URL or Steam vanity URL, and works out which one it got.
- **Player data.** Match history with pagination, per-map statistics, ban history.
- **Rankings.** CS2 leaderboards by region, optionally by country.
- **Documented.** Every endpoint has Swagger docs.

## Getting started

### Prerequisites

- Node.js 18 or later
- A [FACEIT API key](https://developers.faceit.com/)
- A [Steam Web API key](https://steamcommunity.com/dev/apikey)

### Installation

```bash
git clone https://github.com/zdtexus/Faceit_Helper_Server.git
cd Faceit_Helper_Server
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
FACEIT_API_KEY=your_faceit_api_key
STEAM_API_KEY=your_steam_api_key
```

### Running

```bash
npm run start:dev
```

| URL | Description |
|---|---|
| `http://localhost:7777/api` | API base URL |
| `http://localhost:7777/swagger` | Swagger UI |

## API reference

All endpoints are `GET` and use the `/api` prefix.

| Endpoint | Parameters | Description |
|---|---|---|
| `/search/:searchValue` | | Find a player by nickname, FACEIT URL, Steam URL or SteamID64 |
| `/player/:playerId/matches` | `offset`, `limit` (default 100) | Match history |
| `/player/:playerId/maps` | | Per-map statistics |
| `/player/:playerId/bans` | | Ban history |
| `/ranking/region` | `region` (required), `country`, `rank` | Top players, starting at position `rank` |

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Start with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run prod` | Run the compiled build |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint and fix |

## Project structure

```text
config/          API URLs and auth headers for FACEIT and Steam
src/
  search/        Player lookup by any identifier
  player/        Matches, maps, bans
  ranking/       Regional and country leaderboards
  esea/          ESEA league (work in progress)
  main.ts        Bootstrap, CORS, Swagger
```

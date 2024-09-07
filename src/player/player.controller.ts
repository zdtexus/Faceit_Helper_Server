import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PlayerService } from './player.service';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':playerFaceuitId/matches')
  @ApiParam({
    name: 'playerFaceuitId',
    required: true,
    description: 'playerFaceuitId of the player to get matches data',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of matches to retrieve',
    type: Number,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    type: Number,
  })
  async getPlayerMatches(
    @Param('playerFaceuitId') playerFaceuitId: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 100,
  ) {
    if (!playerFaceuitId) {
      throw new HttpException(
        'playerFaceuitId is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const matchesData = await this.playerService.playerMatches(
        playerFaceuitId,
        offset,
        limit,
      );
      return matchesData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':playerFaceuitId/maps')
  @ApiParam({
    name: 'playerFaceuitId',
    required: true,
    description: 'playerFaceuitId of the player to get maps data',
  })
  async getPlayerMaps(@Param('playerFaceuitId') playerFaceuitId: string) {
    if (!playerFaceuitId) {
      throw new HttpException(
        'playerFaceuitId is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const mapsData = await this.playerService.playerMaps(playerFaceuitId);
      return mapsData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':playerFaceuitId/bans')
  @ApiParam({
    name: 'playerFaceuitId',
    required: true,
    description: 'playerFaceuitId of the player to get maps data',
  })
  async getPlayerBans(@Param('playerFaceuitId') playerFaceuitId: string) {
    if (!playerFaceuitId) {
      throw new HttpException(
        'playerFaceuitId is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const mapsData = await this.playerService.playerBans(playerFaceuitId);
      return mapsData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

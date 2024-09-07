import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { RankingService } from './ranking.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('ranking')
@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('region')
  @ApiQuery({
    name: 'region',
    required: true,
    description: 'Region to get rankings for',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    description: 'Country to get rankings for within the region',
  })
  @ApiQuery({
    name: 'rank',
    required: false,
    description: 'Rank offset for pagination',
  })
  async ranking(
    @Query('region') region: string,
    @Query('country') country?: string,
    @Query('rank') rank: number = 0, // Default to 0
  ) {
    if (!region) {
      throw new HttpException('Region is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const playerInfo = await this.rankingService.ranking(
        region,
        country,
        rank,
      );
      return playerInfo;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

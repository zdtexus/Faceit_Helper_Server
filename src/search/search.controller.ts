import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':searchValue')
  @ApiParam({
    name: 'searchValue',
    required: true,
    description: 'Search value to find player data',
  })
  async searchPlayer(@Param('searchValue') searchValue: string) {
    if (!searchValue) {
      throw new HttpException(
        'Search value is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const playerInfo = await this.searchService.searchPlayer(searchValue);
      return playerInfo;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

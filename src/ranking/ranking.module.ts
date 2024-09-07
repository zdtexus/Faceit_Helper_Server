import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}

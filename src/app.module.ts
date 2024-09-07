import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { SearchModule } from './search/search.module';
import { RankingModule } from './ranking/ranking.module';
import { EseaModule } from './esea/esea.module';

@Module({
  imports: [PlayerModule, SearchModule, RankingModule, EseaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

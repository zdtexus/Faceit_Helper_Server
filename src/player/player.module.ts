import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}

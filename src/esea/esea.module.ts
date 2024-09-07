import { Module } from '@nestjs/common';
import { EseaService } from './esea.service';
import { EseaController } from './esea.controller';

@Module({
  controllers: [EseaController],
  providers: [EseaService],
})
export class EseaModule {}

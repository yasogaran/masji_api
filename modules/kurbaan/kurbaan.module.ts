import { Module } from '@nestjs/common';
import { KurbaanService } from './kurbaan.service';
import { KurbaanController } from './kurbaan.controller';

@Module({
  providers: [KurbaanService],
  controllers: [KurbaanController],
  exports: [KurbaanService],
})
export class KurbaanModule {}


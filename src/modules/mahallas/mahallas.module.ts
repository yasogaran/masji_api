import { Module } from '@nestjs/common';
import { MahallasService } from './mahallas.service';
import { MahallasController } from './mahallas.controller';

@Module({
  providers: [MahallasService],
  controllers: [MahallasController],
  exports: [MahallasService],
})
export class MahallasModule {}

import { Module } from '@nestjs/common';
import { MosquesService } from './mosques.service';
import { MosquesController } from './mosques.controller';

@Module({
  providers: [MosquesService],
  controllers: [MosquesController],
  exports: [MosquesService],
})
export class MosquesModule {}


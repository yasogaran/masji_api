import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { HousesController } from './houses.controller';

@Module({
  providers: [HousesService],
  controllers: [HousesController],
  exports: [HousesService],
})
export class HousesModule {}

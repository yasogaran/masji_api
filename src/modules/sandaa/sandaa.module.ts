import { Module } from '@nestjs/common';
import { SandaaService } from './sandaa.service';
import { SandaaController } from './sandaa.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SandaaController],
  providers: [SandaaService],
  exports: [SandaaService],
})
export class SandaaModule {}


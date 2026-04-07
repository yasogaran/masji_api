import { Module } from '@nestjs/common';
import { ZakathController } from './zakath.controller';
import { ZakathService } from './zakath.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ZakathController],
  providers: [ZakathService],
  exports: [ZakathService],
})
export class ZakathModule {}

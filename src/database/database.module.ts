import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MasterPrismaService } from './master-prisma.service';
import { TenantService } from './tenant.service';

@Global()
@Module({
  providers: [PrismaService, MasterPrismaService, TenantService],
  exports: [PrismaService, MasterPrismaService, TenantService],
})
export class DatabaseModule {}


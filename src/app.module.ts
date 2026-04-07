import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PeopleModule } from './modules/people/people.module';
import { MahallasModule } from './modules/mahallas/mahallas.module';
import { HousesModule } from './modules/houses/houses.module';
import { MosquesModule } from './modules/mosques/mosques.module';
import { SandaaModule } from './modules/sandaa/sandaa.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ZakathModule } from './modules/zakath/zakath.module';
import { KurbaanModule } from './modules/kurbaan/kurbaan.module';
import { DonationsModule } from './modules/donations/donations.module';
import { FinanceModule } from './modules/finance/finance.module';
import { BoardModule } from './modules/board/board.module';
import { IssuesModule } from './modules/issues/issues.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FamiliesModule } from './modules/families/families.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PeopleModule,
    MahallasModule,
    HousesModule,
    MosquesModule,
    FamiliesModule,
    SandaaModule,
    PaymentsModule,
    ZakathModule,
    KurbaanModule,
    DonationsModule,
    FinanceModule,
    BoardModule,
    IssuesModule,
    MeetingsModule,
    InventoryModule,
    PropertiesModule,
    ReportsModule,
  ],
})
export class AppModule {}

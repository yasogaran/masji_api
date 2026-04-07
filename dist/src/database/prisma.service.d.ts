import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private static connections;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    static getClientForTenant(dbName: string, dbHost?: string, dbPort?: number): Promise<PrismaClient>;
    static closeAllConnections(): Promise<void>;
}

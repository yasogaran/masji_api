import { Injectable, OnModuleInit, OnModuleDestroy, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static connections: Map<string, PrismaClient> = new Map();

  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Get or create a Prisma client for a specific tenant database
   */
  static async getClientForTenant(
    dbName: string,
    dbHost: string = 'localhost',
    dbPort: number = 3306,
  ): Promise<PrismaClient> {
    const key = `${dbHost}:${dbPort}/${dbName}`;

    if (this.connections.has(key)) {
      return this.connections.get(key)!;
    }

    const databaseUrl = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${dbHost}:${dbPort}/${dbName}`;

    const client = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    await client.$connect();
    this.connections.set(key, client);

    return client;
  }

  /**
   * Close all tenant connections
   */
  static async closeAllConnections() {
    for (const client of this.connections.values()) {
      await client.$disconnect();
    }
    this.connections.clear();
  }
}


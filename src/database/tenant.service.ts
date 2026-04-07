import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterPrismaService } from './master-prisma.service';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

export interface TenantInfo {
  id: string;
  name: string;
  subdomain: string;
  dbName: string;
  dbHost: string;
  dbPort: number;
}

@Injectable()
export class TenantService {
  private tenantCache: Map<string, TenantInfo> = new Map();

  constructor(private masterPrisma: MasterPrismaService) {}

  /**
   * Find tenant by subdomain
   */
  async findBySubdomain(subdomain: string): Promise<TenantInfo | null> {
    // Check cache first
    if (this.tenantCache.has(subdomain)) {
      return this.tenantCache.get(subdomain)!;
    }

    const tenant = await this.masterPrisma.$queryRaw<TenantInfo[]>`
      SELECT id, name, subdomain, db_name as dbName, db_host as dbHost, db_port as dbPort
      FROM tenants
      WHERE subdomain = ${subdomain} AND status = 'active'
      LIMIT 1
    `;

    if (tenant.length === 0) {
      return null;
    }

    // Cache the tenant info
    this.tenantCache.set(subdomain, tenant[0]);
    return tenant[0];
  }

  /**
   * Find tenant by database name
   */
  async findByDbName(dbName: string): Promise<TenantInfo | null> {
    const tenant = await this.masterPrisma.$queryRaw<TenantInfo[]>`
      SELECT id, name, subdomain, db_name as dbName, db_host as dbHost, db_port as dbPort
      FROM tenants
      WHERE db_name = ${dbName} AND status = 'active'
      LIMIT 1
    `;

    return tenant.length > 0 ? tenant[0] : null;
  }

  /**
   * Get Prisma client for a tenant
   */
  async getClientForTenant(tenant: TenantInfo): Promise<PrismaClient> {
    return PrismaService.getClientForTenant(
      tenant.dbName,
      tenant.dbHost,
      tenant.dbPort,
    );
  }

  /**
   * Clear tenant cache (useful when tenant info changes)
   */
  clearCache(subdomain?: string) {
    if (subdomain) {
      this.tenantCache.delete(subdomain);
    } else {
      this.tenantCache.clear();
    }
  }
}


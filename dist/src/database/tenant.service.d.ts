import { MasterPrismaService } from './master-prisma.service';
import { PrismaClient } from '@prisma/client';
export interface TenantInfo {
    id: string;
    name: string;
    subdomain: string;
    dbName: string;
    dbHost: string;
    dbPort: number;
}
export declare class TenantService {
    private masterPrisma;
    private tenantCache;
    constructor(masterPrisma: MasterPrismaService);
    findBySubdomain(subdomain: string): Promise<TenantInfo | null>;
    findByDbName(dbName: string): Promise<TenantInfo | null>;
    getClientForTenant(tenant: TenantInfo): Promise<PrismaClient>;
    clearCache(subdomain?: string): void;
}

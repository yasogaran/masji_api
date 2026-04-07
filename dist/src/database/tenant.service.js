"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const master_prisma_service_1 = require("./master-prisma.service");
const prisma_service_1 = require("./prisma.service");
let TenantService = class TenantService {
    constructor(masterPrisma) {
        this.masterPrisma = masterPrisma;
        this.tenantCache = new Map();
    }
    async findBySubdomain(subdomain) {
        if (this.tenantCache.has(subdomain)) {
            return this.tenantCache.get(subdomain);
        }
        const tenant = await this.masterPrisma.$queryRaw `
      SELECT id, name, subdomain, db_name as dbName, db_host as dbHost, db_port as dbPort
      FROM tenants
      WHERE subdomain = ${subdomain} AND status = 'active'
      LIMIT 1
    `;
        if (tenant.length === 0) {
            return null;
        }
        this.tenantCache.set(subdomain, tenant[0]);
        return tenant[0];
    }
    async findByDbName(dbName) {
        const tenant = await this.masterPrisma.$queryRaw `
      SELECT id, name, subdomain, db_name as dbName, db_host as dbHost, db_port as dbPort
      FROM tenants
      WHERE db_name = ${dbName} AND status = 'active'
      LIMIT 1
    `;
        return tenant.length > 0 ? tenant[0] : null;
    }
    async getClientForTenant(tenant) {
        return prisma_service_1.PrismaService.getClientForTenant(tenant.dbName, tenant.dbHost, tenant.dbPort);
    }
    clearCache(subdomain) {
        if (subdomain) {
            this.tenantCache.delete(subdomain);
        }
        else {
            this.tenantCache.clear();
        }
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [master_prisma_service_1.MasterPrismaService])
], TenantService);
//# sourceMappingURL=tenant.service.js.map
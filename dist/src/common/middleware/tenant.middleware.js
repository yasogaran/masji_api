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
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../../database/tenant.service");
let TenantMiddleware = class TenantMiddleware {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async use(req, res, next) {
        const skipPaths = ['/api/health', '/api/auth/login'];
        if (skipPaths.some((path) => req.path.startsWith(path))) {
            return next();
        }
        let subdomain = this.extractSubdomain(req);
        if (!subdomain && req.headers['x-tenant-id']) {
            subdomain = req.headers['x-tenant-id'];
        }
        if (!subdomain && req.headers.authorization) {
            return next();
        }
        if (!subdomain) {
            return next();
        }
        try {
            const tenant = await this.tenantService.findBySubdomain(subdomain);
            if (!tenant) {
                throw new common_1.UnauthorizedException('Invalid tenant');
            }
            req.tenant = tenant;
            req.tenantDb = await this.tenantService.getClientForTenant(tenant);
            next();
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Tenant resolution failed');
        }
    }
    extractSubdomain(req) {
        const host = req.headers.host || '';
        if (host.includes('localhost') || host.match(/^\d+\.\d+\.\d+\.\d+/)) {
            return null;
        }
        const parts = host.split('.');
        if (parts.length >= 3) {
            return parts[0];
        }
        return null;
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map
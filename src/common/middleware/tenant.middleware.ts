import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService, TenantInfo } from '../../database/tenant.service';
import { PrismaClient } from '@prisma/client';

// Extend Express Request to include tenant info
declare global {
  namespace Express {
    interface Request {
      tenant?: TenantInfo;
      tenantDb?: PrismaClient;
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Skip tenant resolution for certain paths
    const skipPaths = ['/api/health', '/api/auth/login'];
    if (skipPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    // Get tenant from subdomain or header
    let subdomain = this.extractSubdomain(req);

    // For development, also check X-Tenant-ID header
    if (!subdomain && req.headers['x-tenant-id']) {
      subdomain = req.headers['x-tenant-id'] as string;
    }

    // For authenticated requests, tenant info comes from JWT
    // This is handled in the auth guard
    if (!subdomain && req.headers.authorization) {
      return next();
    }

    if (!subdomain) {
      return next(); // Let auth guard handle it
    }

    try {
      const tenant = await this.tenantService.findBySubdomain(subdomain);

      if (!tenant) {
        throw new UnauthorizedException('Invalid tenant');
      }

      req.tenant = tenant;
      req.tenantDb = await this.tenantService.getClientForTenant(tenant);

      next();
    } catch (error) {
      throw new UnauthorizedException('Tenant resolution failed');
    }
  }

  private extractSubdomain(req: Request): string | null {
    const host = req.headers.host || '';

    // For local development: localhost:3000 -> no subdomain
    // For production: tenant.example.com -> tenant
    if (host.includes('localhost') || host.match(/^\d+\.\d+\.\d+\.\d+/)) {
      return null;
    }

    const parts = host.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }

    return null;
  }
}


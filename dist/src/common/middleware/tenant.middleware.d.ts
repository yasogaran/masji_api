import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService, TenantInfo } from '../../database/tenant.service';
import { PrismaClient } from '@prisma/client';
declare global {
    namespace Express {
        interface Request {
            tenant?: TenantInfo;
            tenantDb?: PrismaClient;
        }
    }
}
export declare class TenantMiddleware implements NestMiddleware {
    private tenantService;
    constructor(tenantService: TenantService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
    private extractSubdomain;
}

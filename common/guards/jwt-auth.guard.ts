import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Skip authentication in development mode when SKIP_AUTH is set
    if (process.env.SKIP_AUTH === 'true') {
      const request = context.switchToHttp().getRequest();
      // Set a mock user for development
      request.user = {
        sub: 'dev-user-id',
        phone: '0770000000',
        iat: Date.now(),
        exp: Date.now() + 86400000,
      };
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Please login to access this resource');
    }
    return user;
  }
}


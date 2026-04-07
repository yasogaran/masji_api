import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AdminResetPasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from './decorators/permissions.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.authService.login(loginDto, tenantId);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @Request() req: any,
  ) {
    return this.authService.changePassword(
      req.user.sub,
      req.user.dbName,
      dto,
    );
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.authService.forgotPassword(dto, tenantId);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.authService.verifyOtpAndResetPassword(dto, tenantId);
  }

  @Post('admin-reset-password')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users:admin_reset')
  async adminResetPassword(
    @Body() dto: AdminResetPasswordDto,
    @Request() req: any,
  ) {
    return this.authService.adminResetPassword(
      req.user.sub,
      dto.userId,
      req.user.dbName,
    );
  }
}


import { Controller, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.sub, changePasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('phone') phone: string) {
    return this.authService.forgotPassword(phone);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('phone') phone: string,
    @Body('otpCode') otpCode: string,
  ) {
    return this.authService.verifyOtp(phone, otpCode);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('resetToken') resetToken: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(resetToken, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin-reset/:userId')
  async adminResetPassword(
    @Request() req,
    @Param('userId') userId: string,
  ) {
    // TODO: Add admin permission check
    return this.authService.adminResetPassword(req.user.sub, userId);
  }
}


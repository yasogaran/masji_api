import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            phone: string;
            email: string;
            mustChangePassword: boolean;
            person: {
                id: string;
                fullName: string;
            };
            permissions: string[];
        };
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(phone: string): Promise<{
        message: string;
    }>;
    verifyOtp(phone: string, otpCode: string): Promise<{
        resetToken: string;
    }>;
    resetPassword(resetToken: string, newPassword: string): Promise<{
        message: string;
    }>;
    adminResetPassword(adminId: string, targetUserId: string): Promise<{
        tempPassword: string;
    }>;
}

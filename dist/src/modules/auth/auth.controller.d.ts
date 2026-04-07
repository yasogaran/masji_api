import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
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
    adminResetPassword(req: any, userId: string): Promise<{
        tempPassword: string;
    }>;
}

import { AuthService } from './auth.service';
import { LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, AdminResetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, tenantId: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            phone: string;
            email: string;
            fullName: string;
            mustChangePassword: boolean;
            permissions: string[];
        };
    }>;
    changePassword(dto: ChangePasswordDto, req: any): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto, tenantId: string): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto, tenantId: string): Promise<{
        message: string;
    }>;
    adminResetPassword(dto: AdminResetPasswordDto, req: any): Promise<{
        message: string;
        tempPassword: string;
    }>;
}

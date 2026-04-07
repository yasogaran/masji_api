export declare class LoginDto {
    phone: string;
    password: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class ForgotPasswordDto {
    phone: string;
}
export declare class VerifyOtpDto {
    phone: string;
    otp: string;
}
export declare class ResetPasswordDto {
    phone: string;
    otp: string;
    newPassword: string;
}
export declare class AdminResetPasswordDto {
    userId: string;
}

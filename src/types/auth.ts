// Authentication types
export interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    role: 'USER' | 'OWNER' | 'ADMIN';
    createdAt: string;
}

export interface LoginRequest {
    emailOrPhone: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

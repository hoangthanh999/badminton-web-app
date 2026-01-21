import apiClient from './apiClient';
import { ApiResponse } from '@/types/api';
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
    ForgotPasswordRequest
} from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
    sub: string;
    role: string;
    exp: number;
    iat: number;
}

export const authService = {
    // Login
    login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
        try {
            console.log('🔐 Attempting login:', data.emailOrPhone);
            const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);

            if (response.data.success && response.data.data) {
                const { token, user } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                console.log('✅ Login successful');
            }

            return response.data;
        } catch (error: any) {
            console.error('❌ Login error:', error);
            throw error.response?.data || error;
        }
    },

    // Register
    register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
        try {
            console.log('📝 Attempting registration');
            const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);

            if (response.data.success && response.data.data) {
                const { token, user } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                console.log('✅ Registration successful');
            }

            return response.data;
        } catch (error: any) {
            console.error('❌ Registration error:', error);
            throw error.response?.data || error;
        }
    },

    // Forgot Password
    forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<string>> => {
        try {
            const response = await apiClient.post<ApiResponse<string>>('/auth/forgot-password', data);
            return response.data;
        } catch (error: any) {
            console.error('❌ Forgot password error:', error);
            throw error.response?.data || error;
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('✅ Logout successful');
    },

    // Get current user from localStorage
    getCurrentUser: (): User | null => {
        try {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('❌ Get current user error:', error);
            return null;
        }
    },

    // Get token
    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    // Check if authenticated
    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decoded = jwtDecode<JWTPayload>(token);
            const now = Date.now() / 1000;
            return decoded.exp > now;
        } catch (error) {
            return false;
        }
    },

    // Decode token
    decodeToken: (token: string): JWTPayload | null => {
        try {
            return jwtDecode<JWTPayload>(token);
        } catch (error) {
            console.error('❌ Decode token error:', error);
            return null;
        }
    },

    // Get user role
    getUserRole: (): string | null => {
        const user = authService.getCurrentUser();
        return user?.role || null;
    },

    // Check if admin
    isAdmin: (): boolean => {
        return authService.getUserRole() === 'ADMIN';
    },

    // Check if owner
    isOwner: (): boolean => {
        return authService.getUserRole() === 'OWNER';
    },
};

export default authService;

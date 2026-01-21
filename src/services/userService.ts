import apiClient from './apiClient';
import { ApiResponse } from '@/types/api';
import { User, ChangePasswordRequest } from '@/types/auth';

export const userService = {
    // Get current user profile from server
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get<ApiResponse<User>>('/users/me');
        return response.data;
    },

    // Update profile
    updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
        console.log('📤 Updating profile:', data);
        const response = await apiClient.put<ApiResponse<User>>('/users/profile', data);

        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            console.log('✅ Profile updated');
        }

        return response.data;
    },

    // Refresh user data
    refreshUserData: async (): Promise<User | null> => {
        try {
            console.log('🔄 Refreshing user data...');
            const response = await apiClient.get<ApiResponse<User>>('/users/me');

            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                console.log('✅ User data refreshed');
                return response.data.data;
            }

            return null;
        } catch (error: any) {
            console.error('❌ Refresh user data error:', error);
            throw error;
        }
    },

    // Change password
    changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
        console.log('📤 Changing password...');
        const response = await apiClient.put<ApiResponse<void>>('/users/change-password', data);
        console.log('✅ Password changed successfully');
        return response.data;
    },
};

export default userService;

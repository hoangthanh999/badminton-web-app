import apiClient from './apiClient';
import { ApiResponse, Page } from '@/types/api';
import { User, ChangePasswordRequest } from '@/types/auth';
import { UserDetail, UserCreateRequest, UserUpdateRequest, UserSearchParams, UserStatistics } from '@/types/user';

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

    // ==================== ADMIN METHODS ====================

    // Get all users (admin only)
    getAllUsers: async (
        page = 0,
        size = 10,
        sortBy = 'createdAt',
        sortDirection: 'ASC' | 'DESC' = 'DESC'
    ): Promise<ApiResponse<Page<UserDetail>>> => {
        const response = await apiClient.get<ApiResponse<Page<UserDetail>>>('/admin/users', {
            params: { page, size, sortBy, sortDirection },
        });
        return response.data;
    },

    // Search users with filters
    searchUsers: async (params: UserSearchParams): Promise<ApiResponse<Page<UserDetail>>> => {
        const response = await apiClient.get<ApiResponse<Page<UserDetail>>>('/admin/users/search', {
            params,
        });
        return response.data;
    },

    // Get user by ID (admin only)
    getUserById: async (id: number): Promise<ApiResponse<UserDetail>> => {
        const response = await apiClient.get<ApiResponse<UserDetail>>(`/admin/users/${id}`);
        return response.data;
    },

    // Create user (admin only)
    createUser: async (data: UserCreateRequest): Promise<ApiResponse<User>> => {
        const response = await apiClient.post<ApiResponse<User>>('/admin/users', data);
        return response.data;
    },

    // Update user (admin only)
    updateUser: async (id: number, data: UserUpdateRequest): Promise<ApiResponse<User>> => {
        const response = await apiClient.put<ApiResponse<User>>(`/admin/users/${id}`, data);
        return response.data;
    },

    // Delete user (admin only)
    deleteUser: async (id: number): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/admin/users/${id}`);
        return response.data;
    },

    // Toggle user active status (admin only)
    toggleUserStatus: async (id: number, active: boolean): Promise<ApiResponse<void>> => {
        const response = await apiClient.patch<ApiResponse<void>>(
            `/admin/users/${id}/status`,
            null,
            { params: { active } }
        );
        return response.data;
    },

    // Update user role (admin only)
    updateUserRole: async (id: number, role: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.patch<ApiResponse<void>>(
            `/admin/users/${id}/role`,
            null,
            { params: { role } }
        );
        return response.data;
    },

    // Get user statistics (admin only)
    getUserStatistics: async (): Promise<ApiResponse<UserStatistics>> => {
        const response = await apiClient.get<ApiResponse<UserStatistics>>('/admin/users/statistics');
        return response.data;
    },

    // Reset user password (admin only)
    resetUserPassword: async (id: number, newPassword: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.post<ApiResponse<void>>(`/admin/users/${id}/reset-password`, {
            newPassword,
        });
        return response.data;
    },
};

export default userService;

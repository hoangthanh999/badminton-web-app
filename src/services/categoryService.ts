import apiClient from './apiClient';
import { ApiResponse } from '@/types/api';
import { ProductCategory, CategoryRequest } from '@/types/shop';

export const categoryService = {
    // ==================== PUBLIC METHODS ====================

    // Get all categories
    getAllCategories: async (): Promise<ApiResponse<ProductCategory[]>> => {
        const response = await apiClient.get<ApiResponse<ProductCategory[]>>('/shop/categories');
        return response.data;
    },

    // Get active categories only
    getActiveCategories: async (): Promise<ApiResponse<ProductCategory[]>> => {
        const response = await apiClient.get<ApiResponse<ProductCategory[]>>('/shop/categories/active');
        return response.data;
    },

    // Get category by ID
    getCategoryById: async (id: number): Promise<ApiResponse<ProductCategory>> => {
        const response = await apiClient.get<ApiResponse<ProductCategory>>(`/shop/categories/${id}`);
        return response.data;
    },

    // ==================== ADMIN METHODS ====================

    // Create category (admin only)
    createCategory: async (data: CategoryRequest): Promise<ApiResponse<ProductCategory>> => {
        const response = await apiClient.post<ApiResponse<ProductCategory>>('/shop/categories', data);
        return response.data;
    },

    // Update category (admin only)
    updateCategory: async (id: number, data: CategoryRequest): Promise<ApiResponse<ProductCategory>> => {
        const response = await apiClient.put<ApiResponse<ProductCategory>>(`/shop/categories/${id}`, data);
        return response.data;
    },

    // Delete category (admin only)
    deleteCategory: async (id: number): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/shop/categories/${id}`);
        return response.data;
    },

    // Update category status (admin only)
    updateCategoryStatus: async (id: number, active: boolean): Promise<ApiResponse<void>> => {
        const response = await apiClient.patch<ApiResponse<void>>(
            `/shop/categories/${id}/status`,
            null,
            { params: { active } }
        );
        return response.data;
    },
};

export default categoryService;

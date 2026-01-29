import apiClient from './apiClient';
import { ApiResponse, Page } from '@/types/api';
import {
    Product,
    ProductDetail,
    ProductCategory,
    ProductSearchParams,
    ProductRequest
} from '@/types/shop';

export const productService = {
    // Get all products
    getAllProducts: async (
        page = 0,
        size = 20,
        sortBy = 'createdAt',
        sortDir = 'DESC'
    ): Promise<ApiResponse<Page<Product>>> => {
        const response = await apiClient.get<ApiResponse<Page<Product>>>('/shop/products', {
            params: { page, size, sortBy, sortDir },
        });
        return response.data;
    },

    // Search products
    searchProducts: async (params: ProductSearchParams): Promise<ApiResponse<Page<Product>>> => {
        const response = await apiClient.post<ApiResponse<Page<Product>>>('/shop/products/search', {
            keyword: params.keyword,
            categoryId: params.categoryId,
            brand: params.brand,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            featured: params.featured,
            sortBy: params.sortBy || 'createdAt',
            sortDir: params.sortDir || 'DESC',
            page: params.page || 0,
            size: params.size || 20,
        });
        return response.data;
    },

    // Get product by ID
    getProductById: async (id: number): Promise<ApiResponse<ProductDetail>> => {
        const response = await apiClient.get<ApiResponse<ProductDetail>>(`/shop/products/${id}`);
        return response.data;
    },

    // Get products by category
    getProductsByCategory: async (
        categoryId: number,
        page = 0,
        size = 20
    ): Promise<ApiResponse<Page<Product>>> => {
        const response = await apiClient.get<ApiResponse<Page<Product>>>(
            `/shop/products/category/${categoryId}`,
            { params: { page, size } }
        );
        return response.data;
    },

    // Get categories
    getCategories: async (): Promise<ApiResponse<ProductCategory[]>> => {
        const response = await apiClient.get<ApiResponse<ProductCategory[]>>('/shop/categories/active');
        return response.data;
    },

    // Get featured products
    getFeaturedProducts: async (): Promise<ApiResponse<Product[]>> => {
        const response = await apiClient.get<ApiResponse<Product[]>>('/shop/products/featured');
        return response.data;
    },

    // Get best selling products
    getBestSellingProducts: async (): Promise<ApiResponse<Product[]>> => {
        const response = await apiClient.get<ApiResponse<Product[]>>('/shop/products/best-selling');
        return response.data;
    },

    // Get new products
    getNewProducts: async (): Promise<ApiResponse<Product[]>> => {
        const response = await apiClient.get<ApiResponse<Product[]>>('/shop/products/new-arrivals');
        return response.data;
    },

    // ==================== ADMIN METHODS ====================

    // Create product (admin only)
    createProduct: async (data: ProductRequest): Promise<ApiResponse<Product>> => {
        const response = await apiClient.post<ApiResponse<Product>>('/shop/products', data);
        return response.data;
    },

    // Update product (admin only)
    updateProduct: async (id: number, data: ProductRequest): Promise<ApiResponse<Product>> => {
        const response = await apiClient.put<ApiResponse<Product>>(`/shop/products/${id}`, data);
        return response.data;
    },

    // Delete product (admin only)
    deleteProduct: async (id: number): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/shop/products/${id}`);
        return response.data;
    },

    // Update product status (admin only)
    updateProductStatus: async (id: number, status: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.patch<ApiResponse<void>>(
            `/shop/products/${id}/status`,
            null,
            { params: { status } }
        );
        return response.data;
    },

    // Update product stock (admin only)
    updateProductStock: async (
        id: number,
        quantity: number,
        isIncrease: boolean = true
    ): Promise<ApiResponse<void>> => {
        const response = await apiClient.patch<ApiResponse<void>>(
            `/shop/products/${id}/stock`,
            null,
            { params: { quantity, isIncrease } }
        );
        return response.data;
    },
};

export default productService;

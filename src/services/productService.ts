import apiClient from './apiClient';
import { ApiResponse, Page } from '@/types/api';
import {
    Product,
    ProductDetail,
    ProductCategory,
    ProductSearchParams
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
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
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
};

export default productService;

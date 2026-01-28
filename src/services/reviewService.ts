import apiClient from './apiClient';
import { ApiResponse, Page } from '@/types/api';
import { ProductReview } from '@/types/shop';

export const reviewService = {
    // ==================== PUBLIC METHODS ====================

    // Get product reviews
    getProductReviews: async (
        productId: number,
        page = 0,
        size = 10
    ): Promise<ApiResponse<Page<ProductReview>>> => {
        const response = await apiClient.get<ApiResponse<Page<ProductReview>>>(
            `/shop/reviews/product/${productId}`,
            { params: { page, size } }
        );
        return response.data;
    },

    // Get reviews by rating
    getReviewsByRating: async (
        productId: number,
        rating: number,
        page = 0,
        size = 10
    ): Promise<ApiResponse<Page<ProductReview>>> => {
        const response = await apiClient.get<ApiResponse<Page<ProductReview>>>(
            `/shop/reviews/product/${productId}/rating/${rating}`,
            { params: { page, size } }
        );
        return response.data;
    },

    // Get latest verified reviews
    getLatestVerifiedReviews: async (limit = 10): Promise<ApiResponse<ProductReview[]>> => {
        const response = await apiClient.get<ApiResponse<ProductReview[]>>(
            '/shop/reviews/latest-verified',
            { params: { limit } }
        );
        return response.data;
    },

    // ==================== ADMIN METHODS ====================

    // Delete review (admin only)
    deleteReview: async (id: number): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/shop/reviews/${id}`);
        return response.data;
    },
};

export default reviewService;

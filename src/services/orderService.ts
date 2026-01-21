import apiClient from './apiClient';
import { ApiResponse, Page } from '@/types/api';
import { Order, CreateOrderRequest } from '@/types/shop';

export const orderService = {
    // Create order
    createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
        const response = await apiClient.post<ApiResponse<Order>>('/shop/orders', data);
        return response.data;
    },

    // Get my orders
    getMyOrders: async (page = 0, size = 10, status?: string): Promise<ApiResponse<Page<Order>>> => {
        const url = status
            ? `/shop/orders/my-orders/status/${status}`
            : '/shop/orders/my-orders';

        const response = await apiClient.get<ApiResponse<Page<Order>>>(url, {
            params: { page, size },
        });
        return response.data;
    },

    // Get order by ID
    getOrderById: async (id: number): Promise<ApiResponse<Order>> => {
        const response = await apiClient.get<ApiResponse<Order>>(`/shop/orders/${id}`);
        return response.data;
    },

    // Cancel order
    cancelOrder: async (id: number, reason: string): Promise<ApiResponse<Order>> => {
        const response = await apiClient.post<ApiResponse<Order>>(
            `/shop/orders/${id}/cancel`,
            null,
            { params: { reason } }
        );
        return response.data;
    },
};

export default orderService;

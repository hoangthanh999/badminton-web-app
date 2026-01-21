import apiClient from './apiClient';
import { ApiResponse } from '@/types/api';
import { Payment, PaymentRequest, MoMoPaymentResponse } from '@/types/payment';

export const paymentService = {
    // Create MoMo payment
    createMoMoPayment: async (data: PaymentRequest): Promise<MoMoPaymentResponse> => {
        try {
            const response = await apiClient.post<ApiResponse<MoMoPaymentResponse>>(
                '/payments/momo/create',
                data
            );
            return response.data.data;
        } catch (error) {
            console.error('❌ Create MoMo payment error:', error);
            throw error;
        }
    },

    // Confirm mock payment
    confirmMockPayment: async (orderId: string, resultCode = 0): Promise<Payment> => {
        try {
            const response = await apiClient.post<ApiResponse<Payment>>(
                `/payments/mock/confirm/${orderId}`,
                null,
                { params: { resultCode } }
            );
            return response.data.data;
        } catch (error) {
            console.error('❌ Confirm mock payment error:', error);
            throw error;
        }
    },

    // Get payment by booking
    getPaymentByBooking: async (bookingId: number): Promise<Payment> => {
        try {
            const response = await apiClient.get<ApiResponse<Payment>>(`/payments/booking/${bookingId}`);
            return response.data.data;
        } catch (error) {
            console.error('❌ Get payment by booking error:', error);
            throw error;
        }
    },

    // Check payment status
    checkPaymentStatus: async (bookingId: number): Promise<Payment> => {
        try {
            const response = await apiClient.get<ApiResponse<Payment>>(`/payments/booking/${bookingId}`);
            return response.data.data;
        } catch (error) {
            console.error('❌ Check payment status error:', error);
            throw error;
        }
    },
};

export default paymentService;

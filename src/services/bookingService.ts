import apiClient from './apiClient';
import { ApiResponse, Page, PaginationParams } from '@/types/api';
import { Booking, BookingRequest } from '@/types/booking';

export const bookingService = {
    // ================= USER =================
    // Create booking
    createBooking: async (data: BookingRequest): Promise<ApiResponse<Booking>> => {
        const response = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
        return response.data;
    },

    // Get my bookings
    getMyBookings: async (params?: PaginationParams): Promise<ApiResponse<Page<Booking>>> => {
        const response = await apiClient.get<ApiResponse<Page<Booking>>>('/bookings/my-bookings', {
            params: { page: 0, size: 10, ...params },
        });
        return response.data;
    },

    // Get booking by ID
    getBookingById: async (id: number): Promise<ApiResponse<Booking>> => {
        const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (id: number): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/bookings/${id}`);
        return response.data;
    },

    // ================= OWNER =================
    // Get owner bookings
    getOwnerBookings: async (params?: PaginationParams): Promise<ApiResponse<Page<Booking>>> => {
        const response = await apiClient.get<ApiResponse<Page<Booking>>>('/bookings/owner-bookings', {
            params: { page: 0, size: 10, ...params },
        });
        return response.data;
    },

    // Get court bookings
    getCourtBookings: async (courtId: number): Promise<ApiResponse<Booking[]>> => {
        const response = await apiClient.get<ApiResponse<Booking[]>>(`/bookings/court/${courtId}`);
        return response.data;
    },

    // ================= ADMIN =================
    // Get all bookings
    getAllBookings: async (params?: PaginationParams): Promise<ApiResponse<Page<Booking>>> => {
        const response = await apiClient.get<ApiResponse<Page<Booking>>>('/bookings/all', {
            params: { page: 0, size: 10, ...params },
        });
        return response.data;
    },

    // Update booking status
    updateBookingStatus: async (id: number, status: string): Promise<ApiResponse<Booking>> => {
        const response = await apiClient.patch<ApiResponse<Booking>>(
            `/bookings/${id}/status`,
            null,
            { params: { status } }
        );
        return response.data;
    },
};

export default bookingService;

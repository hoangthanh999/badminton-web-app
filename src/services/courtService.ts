import apiClient from './apiClient';
import { ApiResponse, Page, PaginationParams } from '@/types/api';
import { Court, CourtRequest, CourtSearchParams } from '@/types/court';

export const courtService = {
    // Get all courts
    getAllCourts: async (params?: PaginationParams): Promise<ApiResponse<Page<Court>>> => {
        const response = await apiClient.get<ApiResponse<Page<Court>>>('/courts', {
            params: { page: 0, size: 10, sortBy: 'createdAt', sortDir: 'DESC', ...params },
        });
        return response.data;
    },

    // Search courts
    searchCourts: async (params: CourtSearchParams): Promise<ApiResponse<Page<Court>>> => {
        const response = await apiClient.get<ApiResponse<Page<Court>>>('/courts/search', { params });
        return response.data;
    },

    // Get court by ID
    getCourtById: async (id: number): Promise<ApiResponse<Court>> => {
        const response = await apiClient.get<ApiResponse<Court>>(`/courts/${id}`);
        return response.data;
    },

    // Get my courts (for owners)
    getMyCourts: async (): Promise<ApiResponse<Court[]>> => {
        const response = await apiClient.get<ApiResponse<Court[]>>('/courts/my-courts');
        return response.data;
    },

    // ================= ADMIN/OWNER =================
    // Create court
    createCourt: async (data: CourtRequest): Promise<ApiResponse<Court>> => {
        console.log('📤 Creating court:', data);
        const response = await apiClient.post<ApiResponse<Court>>('/courts', data);
        console.log('✅ Court created:', response.data);
        return response.data;
    },

    // Update court
    updateCourt: async (id: number, data: Partial<CourtRequest>): Promise<ApiResponse<Court>> => {
        console.log('📤 Updating court:', id, data);
        const response = await apiClient.put<ApiResponse<Court>>(`/courts/${id}`, data);
        console.log('✅ Court updated:', response.data);
        return response.data;
    },

    // Delete court
    deleteCourt: async (id: number): Promise<ApiResponse<void>> => {
        console.log('🗑️ Deleting court:', id);
        const response = await apiClient.delete<ApiResponse<void>>(`/courts/${id}`);
        console.log('✅ Court deleted');
        return response.data;
    },

    // Update court status
    updateCourtStatus: async (
        id: number,
        status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
    ): Promise<ApiResponse<Court>> => {
        console.log('📤 Updating court status:', id, status);
        const response = await apiClient.patch<ApiResponse<Court>>(`/courts/${id}/status`, null, {
            params: { status },
        });
        console.log('✅ Court status updated');
        return response.data;
    },
};

export default courtService;

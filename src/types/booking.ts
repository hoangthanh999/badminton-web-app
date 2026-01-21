// Booking types
export interface Booking {
    id: number;
    courtId: number;
    courtName: string;
    courtAddress: string;
    courtNumber: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    notes?: string;
    createdAt: string;
    user?: {
        id: number;
        fullName: string;
        email: string;
        phone: string;
    };
    payment?: {
        id: number;
        status: string;
        paymentType: string;
        amount: number;
        depositAmount: number;
        remainingAmount: number;
    };
}

export interface BookingRequest {
    courtId: number;
    courtNumber: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
}

export interface BookingStats {
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
}

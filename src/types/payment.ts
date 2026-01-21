// Payment types
export interface Payment {
    id: number;
    bookingId: number;
    amount: number;
    depositAmount: number;
    remainingAmount: number;
    paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'MOMO' | 'VNPAY';
    paymentType: 'FULL' | 'DEPOSIT';
    status: 'PENDING' | 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'EXPIRED';
    transactionId?: string;
    orderId: string;
    requestId: string;
    createdAt: string;
    paidAt?: string;
    expiredAt?: string;
}

export interface PaymentRequest {
    bookingId: number;
    paymentType: 'FULL' | 'DEPOSIT';
    returnUrl?: string;
}

export interface MoMoPaymentResponse {
    payUrl: string;
    orderId: string;
    requestId: string;
    message: string;
    resultCode: number;
}

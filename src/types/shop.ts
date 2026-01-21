// Shop types
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    categoryId: number;
    categoryName: string;
    status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
    featured: boolean;
    bestseller: boolean;
    createdAt: string;
}

export interface ProductDetail extends Product {
    specifications?: string;
    warranty?: string;
}

export interface ProductCategory {
    id: number;
    name: string;
    description?: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface ProductSearchParams {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
}

export interface CartItem {
    productId: number;
    productName: string;
    productImage: string;
    price: number;
    discountPrice?: number;
    quantity: number;
    stock: number;
}

export interface Order {
    id: number;
    orderCode: string;
    userId: number;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    shippingProvince: string;
    shippingDistrict: string;
    shippingWard: string;
    note?: string;
    totalAmount: number;
    shippingFee: number;
    finalAmount: number;
    paymentMethod: 'COD' | 'MOMO' | 'VNPAY' | 'ZALOPAY';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    orderStatus: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface CreateOrderRequest {
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    shippingProvince: string;
    shippingDistrict: string;
    shippingWard: string;
    note?: string;
    paymentMethod: 'COD' | 'MOMO' | 'VNPAY' | 'ZALOPAY';
}

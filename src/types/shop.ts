// frontend/src/types/shop.ts

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    discountPrice?: number;
    stockQuantity: number;
    stock?: number; // Alias for backward compatibility
    categoryId: number;
    categoryName: string;
    brand?: string;
    images: string[];
    status: string;
    featured: boolean;
    bestseller?: boolean;
    averageRating?: number;
    reviewCount?: number;
    soldQuantity?: number;
    specifications?: string;
    warranty?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface ProductDetail extends Product {
    category?: ProductCategory;
    relatedProducts?: Product[];
    recentReviews?: ProductReview[];
}

export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
    status: string;
    active?: boolean;
    productCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Order {
    id: number;
    orderNumber?: string;
    orderCode?: string; // Keep for backward compatibility
    userId: number;
    userName?: string;
    userPhone?: string;
    items: OrderItem[];
    subtotal: number;
    totalAmount: number;
    finalAmount?: number; // Alias
    shippingFee: number;
    discount: number;
    status: string;
    orderStatus?: string; // Alias
    paymentMethod: string;
    paymentStatus: string;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    shippingProvince: string;
    shippingDistrict: string;
    shippingWard: string;
    note?: string;
    createdAt: string;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    cancelReason?: string;
}

export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage?: string;
    price: number;
    quantity: number;
    subtotal: number;
    totalPrice?: number; // Alias
}

export interface ProductRequest {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    stockQuantity: number;
    categoryId: number;
    brand?: string;
    featured?: boolean;
    images?: string[];
    specifications?: Record<string, string>;
}

export interface CategoryRequest {
    name: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
}

export interface UpdateOrderStatusRequest {
    status: string;
    note?: string;
}

export interface ProductReview {
    id: number;
    productId: number;
    productName?: string;
    userId: number;
    userName: string;
    orderId?: number;
    rating: number;
    comment: string;
    images?: string[];
    verified: boolean;
    createdAt: string;
}

export interface ShopStatistics {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    shippingOrders: number;
    completedOrders?: number;
    totalRevenue: number;
    todayRevenue: number;
    monthRevenue: number;
    lowStockProducts: number;
    outOfStockProducts: number;
}

// ✅ THÊM: Types còn thiếu

export interface ProductSearchParams {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
}

export interface CreateOrderRequest {
    items: OrderItemRequest[];
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    shippingProvince: string;
    shippingDistrict: string;
    shippingWard: string;
    note?: string;
    paymentMethod: PaymentMethod;
}

export interface OrderItemRequest {
    productId: number;
    quantity: number;
}

export enum PaymentMethod {
    COD = 'COD',
    MOMO = 'MOMO',
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    id: number;
    cartId: number;
    productId: number;
    productName: string;
    productImage?: string;
    price: number;
    quantity: number;
    subtotal: number;
    createdAt: string;
}

export interface AddToCartRequest {
    productId: number;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

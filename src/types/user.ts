import { User } from './auth';

// Extended user type for admin management
export interface UserDetail extends User {
    address?: string;
    avatar?: string;
    active: boolean;
    lastLogin?: string;
    totalBookings: number;
    totalOrders: number;
    totalSpent: number;
}

// Request types for user management
export interface UserCreateRequest {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: 'USER' | 'OWNER' | 'ADMIN';
    address?: string;
    avatar?: string;
    active: boolean;
}

export interface UserUpdateRequest {
    fullName?: string;
    email?: string;
    phone?: string;
    role?: 'USER' | 'OWNER' | 'ADMIN';
    address?: string;
    avatar?: string;
    active?: boolean;
}

// Filter and search params
export interface UserSearchParams {
    keyword?: string;
    role?: string;
    active?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

// Statistics
export interface UserStatistics {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    newUsersThisMonth: number;
    usersByRole: {
        USER: number;
        OWNER: number;
        ADMIN: number;
    };
}

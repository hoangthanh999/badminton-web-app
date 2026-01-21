// Court types
export interface Court {
    id: number;
    name: string;
    address: string;
    description: string;
    pricePerHour: number;
    numberOfCourts: number;
    openTime: string;
    closeTime: string;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    images?: string[];
    facilities?: string[];
    owner: {
        id: number;
        fullName: string;
        email: string;
    };
}

export interface CourtRequest {
    name: string;
    address: string;
    description: string;
    pricePerHour: number;
    numberOfCourts: number;
    openTime: string;
    closeTime: string;
    images?: string[];
    facilities?: string[];
}

export interface CourtSearchParams {
    name?: string;
    address?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
}

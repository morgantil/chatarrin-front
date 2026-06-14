export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  role: Role;
  province: string;
  locality?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: Role;
    province: string;
  };
}

export interface Locality {
  id: string;
  name: string;
  province: string;
  slug?: string;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  weightKg: number;
  priceArs?: number;
  isNegotiable: boolean;
  photos: string[];
  province: string;
  localityId?: string;
  locality?: Locality;
  status: 'ACTIVE' | 'SOLD' | 'PAUSED';
  visibility: 'FREE' | 'NORMAL' | 'FEATURED' | 'URGENT';
  visitCount: number;
  expiresAt?: string;
  createdAt: string;
  category: { id: string; name: string; slug: string };
  seller: {
    id: string;
    name: string;
    province: string;
    locality?: { id: string; name: string };
    isVerified: boolean;
    avatarUrl?: string;
    whatsapp?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LogisticsProfile {
  id: string;
  companyName?: string;
  description: string;
  coverageProvinces: string[];
  visibility: 'FREE' | 'NORMAL' | 'FEATURED';
  user: { id: string; name: string; whatsapp?: string };
}

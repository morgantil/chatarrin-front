import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Publication, Category, PaginatedResponse } from '@/types';

interface Filters {
  categorySlug?: string;
  province?: string;
  minKg?: number;
  maxKg?: number;
  minPrice?: number;
  maxPrice?: number;
  hasPhoto?: boolean;
  sortBy?: string;
  visibility?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.categorySlug) params.set('categorySlug', filters.categorySlug);
  if (filters.province) params.set('province', filters.province);
  if (filters.minKg) params.set('minKg', String(filters.minKg));
  if (filters.maxKg) params.set('maxKg', String(filters.maxKg));
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.hasPhoto) params.set('hasPhoto', 'true');
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.visibility) params.set('visibility', filters.visibility);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  return params.toString();
}

export function usePublications(filters: Filters) {
  return useQuery({
    queryKey: ['publications', filters],
    queryFn: () => api.get<PaginatedResponse<Publication>>(`/api/publications?${buildQuery(filters)}`),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/api/categories'),
    staleTime: Infinity,
  });
}

export function usePublication(id: string) {
  return useQuery({
    queryKey: ['publication', id],
    queryFn: () => api.get<Publication>(`/api/publications/${id}`),
    enabled: !!id,
  });
}

export function useSellerProfile(sellerId: string) {
  return useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => api.get<any>(`/api/publications/seller/${sellerId}`),
    enabled: !!sellerId,
  });
}

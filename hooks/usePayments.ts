'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Tipos
export interface PriceInfo {
  visibility: 'NORMAL' | 'FEATURED' | 'URGENT';
  label: string;
  description: string;
  priceArs: number;
  durationDays: number;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  paymentId: string;
}

// Obtener precios actuales desde settings del backend
export function usePrices() {
  return useQuery({
    queryKey: ['payment-prices'],
    queryFn: () => api.get<PriceInfo[]>('/api/payments/prices'),
    staleTime: 1000 * 60 * 5, // cache 5 minutos
  });
}

// Iniciar checkout
export function useCheckout() {
  return useMutation({
    mutationFn: (data: { publicationId: string; visibility: string }) =>
      api.post<CheckoutResponse>('/api/payments/checkout', data),
  });
}

// Historial de pagos del usuario
export function useMyPayments() {
  return useQuery({
    queryKey: ['my-payments'],
    queryFn: () => api.get<any[]>('/api/payments/my'),
  });
}

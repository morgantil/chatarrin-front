import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Locality {
  id: string;
  name: string;
  province: string;
  zone?: string;
  slug?: string;
}

export function useZones(province: string | undefined) {
  return useQuery({
    queryKey: ['zones', province],
    queryFn: () =>
      api.get<string[]>(`/api/localities/zones?province=${encodeURIComponent(province!)}`),
    enabled: !!province,
    staleTime: Infinity,
  });
}

export function useLocalities(province: string | undefined, zone?: string | undefined) {
  const params = new URLSearchParams();
  if (province) params.set('province', province);
  if (zone) params.set('zone', zone);

  return useQuery({
    queryKey: ['localities', province, zone],
    queryFn: () => api.get<Locality[]>(`/api/localities?${params.toString()}`),
    enabled: !!province && !!zone,
    staleTime: Infinity,
  });
}

export function useLocalitySearch(province: string | undefined, query: string, zone?: string) {
  const params = new URLSearchParams();
  if (province) params.set('province', province);
  if (zone) params.set('zone', zone);
  params.set('q', query);

  return useQuery({
    queryKey: ['localities-search', province, zone, query],
    queryFn: () => api.get<Locality[]>(`/api/localities/search?${params.toString()}`),
    enabled: !!province && query.length >= 2,
    staleTime: 30_000,
  });
}

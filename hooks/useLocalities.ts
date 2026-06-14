import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Locality {
  id: string;
  name: string;
  province: string;
  slug?: string;
}

export function useLocalities(province: string | undefined) {
  return useQuery({
    queryKey: ['localities', province],
    queryFn: () =>
      api.get<Locality[]>(`/api/localities?province=${encodeURIComponent(province!)}`),
    enabled: !!province,
    staleTime: Infinity,
  });
}

export function useLocalitySearch(province: string | undefined, query: string) {
  return useQuery({
    queryKey: ['localities-search', province, query],
    queryFn: () =>
      api.get<Locality[]>(
        `/api/localities/search?province=${encodeURIComponent(province!)}&q=${encodeURIComponent(query)}`
      ),
    enabled: !!province && query.length >= 2,
    staleTime: 30_000,
  });
}

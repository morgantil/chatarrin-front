import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { LogisticsProfile } from '@/types';

export function useLogisticsCarousel(province: string, weightKg: number) {
  return useQuery({
    queryKey: ['logistics-carousel', province, weightKg],
    queryFn: () =>
      api.get<LogisticsProfile[]>(
        `/api/logistics/carousel?province=${encodeURIComponent(province)}&weightKg=${weightKg}`
      ),
    enabled: !!province && !!weightKg,
  });
}

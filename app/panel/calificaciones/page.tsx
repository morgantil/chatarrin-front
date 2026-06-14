'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Star } from 'lucide-react';

export default function ReviewsPage() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => api.get<any[]>('/api/reviews/mine'),
  });

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Calificaciones</h1>

        {isLoading ? (
          <LoadingSpinner />
        ) : !reviews || reviews.length === 0 ? (
          <EmptyState message="Todavía no tenés calificaciones" />
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((r: any) => (
              <div key={r.id} className="border rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{r.reviewer?.name || 'Anónimo'}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n}
                        className={`h-3 w-3 ${n <= r.stars ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                <p className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString('es-AR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

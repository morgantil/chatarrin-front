'use client';

import { useState } from 'react';
import { usePublications } from '@/hooks/usePublications';
import { PublicationCard } from '@/components/publications/PublicationCard';
import { PublicationFilters } from '@/components/publications/PublicationFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PublicationsPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('Más reciente');

  const sortByMap: Record<string, string> = {
    'Más reciente': 'createdAt_desc',
    'Más visitado': 'visitCount_desc',
    'Menor precio': 'price_asc',
    'Mayor peso': 'weight_desc',
  };

  const { data, isLoading, error } = usePublications({
    ...filters,
    page,
    limit: 20,
    sortBy: sortByMap[sortBy] ?? 'createdAt_desc',
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6 py-2">

      {/* Header */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Publicaciones</h1>
          {data && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {data.total ?? data.data.length} resultados
            </p>
          )}
        </div>
      </div>

      {/* Filtros */}
      <PublicationFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Contenido */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500 text-sm">Error al cargar publicaciones</p>
      ) : !data || data.data.length === 0 ? (
        <EmptyState message="No hay publicaciones que coincidan con los filtros" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.data.map((pub) => (
              <PublicationCard key={pub.id} pub={pub} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <span className="text-sm text-muted-foreground px-2">
                {data.page} / {data.totalPages}
              </span>
              <button
                disabled={page === data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

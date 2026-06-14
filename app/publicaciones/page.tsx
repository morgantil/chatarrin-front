'use client';

import { useState } from 'react';
import { usePublications } from '@/hooks/usePublications';
import { PublicationCard } from '@/components/publications/PublicationCard';
import { PublicationFilters } from '@/components/publications/PublicationFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PublicationsPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('Más reciente');

  const { data, isLoading, error } = usePublications({ ...filters, page, limit: 20 });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // volver a página 1 al cambiar filtros
  };

  const handleReset = () => {
    setFilters({});
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Publicaciones</h1>
        <p className="text-sm text-muted-foreground">
          Explorá los metales reciclables disponibles
        </p>
      </div>

      <PublicationFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

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
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {data.page} de {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

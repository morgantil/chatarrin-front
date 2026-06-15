'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useCategories } from '@/hooks/usePublications';
import { useZones, useLocalities } from '@/hooks/useLocalities';

const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

const SORT_OPTIONS = ['Más reciente', 'Más visitado', 'Menor precio', 'Mayor peso'];

const pillClass =
  'shrink-0 h-8 px-3 text-xs font-medium rounded-full border border-border bg-card text-foreground cursor-pointer hover:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand transition-colors appearance-none pr-6';

const chevronStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 8px center' as const,
};

interface Props {
  filters: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function PublicationFilters({ filters, onChange, onReset, sortBy, onSortChange }: Props) {
  const { data: categories } = useCategories();
  const { data: zones } = useZones(filters.province);
  const { data: localities } = useLocalities(
    filters.zone && filters.province ? filters.province : undefined,
    filters.zone
  );
  const hasFilters = Object.values(filters).some(Boolean);

  function handleProvinceChange(province: string) {
    onChange('province', province || undefined);
    onChange('zone', undefined);
    onChange('localityId', undefined);
  }

  function handleZoneChange(zone: string) {
    onChange('zone', zone || undefined);
    onChange('localityId', undefined);
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Fila principal */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">

        {/* Categoría */}
        <select
          value={filters.categorySlug || ''}
          onChange={(e) => onChange('categorySlug', e.target.value || undefined)}
          className={pillClass} style={chevronStyle}
        >
          <option value="">Material</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        {/* Provincia */}
        <select
          value={filters.province || ''}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className={pillClass} style={chevronStyle}
        >
          <option value="">Provincia</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Zona — solo si la provincia tiene zonas */}
        {filters.province && zones && zones.length > 0 && (
          <select
            value={filters.zone || ''}
            onChange={(e) => handleZoneChange(e.target.value)}
            className={pillClass} style={chevronStyle}
          >
            <option value="">Zona</option>
            {zones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        )}

        {/* Localidad — solo si hay zona con localidades */}
        {filters.zone && localities && localities.length > 0 && (
          <select
            value={filters.localityId || ''}
            onChange={(e) => onChange('localityId', e.target.value || undefined)}
            className={pillClass} style={chevronStyle}
          >
            <option value="">Localidad</option>
            {localities.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        )}

        {/* Kg mínimo */}
        <input
          type="number"
          placeholder="Kg mín."
          className="shrink-0 w-24 h-8 px-3 text-xs font-medium rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
          value={filters.minKg || ''}
          onChange={(e) => onChange('minKg', e.target.value ? Number(e.target.value) : undefined)}
        />

        {/* Precio máx */}
        <input
          type="number"
          placeholder="Precio máx."
          className="shrink-0 w-28 h-8 px-3 text-xs font-medium rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
          value={filters.maxPrice || ''}
          onChange={(e) => onChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
        />

        {/* Solo con foto */}
        <label className="shrink-0 flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-full border border-border bg-card text-foreground cursor-pointer hover:border-brand/50 transition-colors select-none">
          <input
            type="checkbox"
            checked={!!filters.hasPhoto}
            onChange={(e) => onChange('hasPhoto', e.target.checked ? true : undefined)}
            className="w-3 h-3 accent-brand"
          />
          Con foto
        </label>

        {/* Limpiar */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="shrink-0 flex items-center gap-1 h-8 px-3 text-xs font-medium rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            <X className="h-3 w-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Ordenamiento */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground shrink-0">Ordenar:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => onSortChange(opt)}
            className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
              sortBy === opt
                ? 'bg-brand text-white border-brand'
                : 'bg-transparent text-muted-foreground border-border hover:border-brand/50 hover:text-foreground'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

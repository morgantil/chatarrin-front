'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useCategories } from '@/hooks/usePublications';

const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

interface Props {
  filters: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function PublicationFilters({ filters, onChange, onReset, sortBy, onSortChange }: Props) {
  const { data: categories } = useCategories();
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {/* Fila de filtros tipo chips */}
      <div className="flex flex-wrap gap-2 items-center">

        {/* Material */}
        <Select value={filters.categorySlug || ''} onValueChange={(v) => onChange('categorySlug', v || undefined)}>
          <SelectTrigger className="w-auto min-w-[140px] h-8 text-sm">
            <SelectValue placeholder="Material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los materiales</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Provincia */}
        <Select value={filters.province || ''} onValueChange={(v) => onChange('province', v || undefined)}>
          <SelectTrigger className="w-auto min-w-[140px] h-8 text-sm">
            <SelectValue placeholder="Provincia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las provincias</SelectItem>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Kg mínimo */}
        <Input
          type="number" placeholder="Kg mínimo"
          className="w-32 h-8 text-sm"
          value={filters.minKg || ''}
          onChange={(e) => onChange('minKg', e.target.value ? Number(e.target.value) : undefined)}
        />

        {/* Precio máximo */}
        <Input
          type="number" placeholder="Precio máx (ARS)"
          className="w-40 h-8 text-sm"
          value={filters.maxPrice || ''}
          onChange={(e) => onChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
        />

        {/* Reset */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-8 gap-1 text-muted-foreground">
            <X className="h-3 w-3" /> Limpiar
          </Button>
        )}
      </div>

      {/* Ordenamiento secundario */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Ordenar por:</span>
        {['Más reciente', 'Menor precio', 'Mayor peso'].map((opt) => (
          <button key={opt}
            onClick={() => onSortChange(opt)}
            className={`px-2 py-0.5 rounded-full text-xs border transition-colors ${
              sortBy === opt
                ? 'bg-brand text-white border-brand'
                : 'border-border hover:border-brand hover:text-brand'
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

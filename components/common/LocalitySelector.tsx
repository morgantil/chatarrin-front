'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocalities } from '@/hooks/useLocalities';
import { MapPin, Search, X } from 'lucide-react';

interface Props {
  province: string | undefined;
  value: string | undefined;
  onChange: (localityId: string, localityName: string) => void;
  placeholder?: string;
  className?: string;
}

const inputClass =
  'flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand transition-colors';

export function LocalitySelector({ province, value, onChange, placeholder, className }: Props) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: localities, isLoading } = useLocalities(province);

  // Resetear al cambiar de provincia
  useEffect(() => {
    setSearch('');
    setSelectedName('');
    onChange('', '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [province]);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = localities?.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  function handleSelect(id: string, name: string) {
    setSelectedName(name);
    setSearch('');
    setIsOpen(false);
    onChange(id, name);
  }

  function handleClear() {
    setSelectedName('');
    setSearch('');
    onChange('', '');
  }

  if (!province) {
    return (
      <div className={`flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-muted/50 text-sm text-muted-foreground ${className ?? ''}`}>
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        Seleccioná una provincia primero
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          className={`${inputClass} pl-9 ${selectedName && !isOpen ? 'pr-8' : ''}`}
          placeholder={selectedName || placeholder || 'Buscar localidad...'}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
        />
        {selectedName && !isOpen && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {selectedName && !isOpen && (
        <p className="text-xs text-brand mt-1 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {selectedName}
        </p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {isLoading ? (
            <p className="p-3 text-sm text-muted-foreground text-center">Cargando...</p>
          ) : filtered.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground text-center">Sin resultados</p>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleSelect('', '')}
                className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:bg-muted border-b border-border transition-colors"
              >
                Toda la provincia
              </button>
              {filtered.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc.id, loc.name)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors ${
                    value === loc.id ? 'bg-brand/10 text-brand font-medium' : 'text-foreground'
                  }`}
                >
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                  {loc.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

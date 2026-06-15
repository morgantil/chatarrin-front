'use client';

import { useState, useEffect, useRef } from 'react';
import { useZones, useLocalities } from '@/hooks/useLocalities';
import { MapPin, Search, X } from 'lucide-react';

interface Props {
  province: string | undefined;
  value: string | undefined;
  onChange: (localityId: string, localityName: string, zone?: string) => void;
  placeholder?: string;
  className?: string;
}

const selectClass =
  'flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand transition-colors appearance-none cursor-pointer pr-8';

const inputClass =
  'flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand transition-colors';

// Zonas sin localidades (son la selección final en sí mismas)
const ZONES_WITHOUT_LOCALITIES = ['CABA'];

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`;

export function LocalitySelector({ province, value, onChange, placeholder, className }: Props) {
  const [selectedZone, setSelectedZone] = useState('');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: zones } = useZones(province);
  const { data: localities, isLoading } = useLocalities(
    selectedZone && !ZONES_WITHOUT_LOCALITIES.includes(selectedZone) ? province : undefined,
    selectedZone && !ZONES_WITHOUT_LOCALITIES.includes(selectedZone) ? selectedZone : undefined
  );

  const hasZones = zones && zones.length > 0;
  const isZoneWithoutLocalities = ZONES_WITHOUT_LOCALITIES.includes(selectedZone);

  // Resetear al cambiar provincia
  useEffect(() => {
    setSelectedZone('');
    setSelectedName('');
    setSearch('');
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

  function handleZoneChange(zone: string) {
    setSelectedZone(zone);
    setSelectedName('');
    setSearch('');

    if (ZONES_WITHOUT_LOCALITIES.includes(zone)) {
      // CABA: la zona es la selección final
      setSelectedName(zone);
      onChange('caba', zone, zone);
    } else {
      onChange('', '', zone);
    }
  }

  function handleSelect(id: string, name: string) {
    setSelectedName(name);
    setSearch('');
    setIsOpen(false);
    onChange(id, name, selectedZone);
  }

  function handleClear() {
    setSelectedZone('');
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

  // Provincia sin zonas → buscador simple
  if (!hasZones) {
    const filtered = localities?.filter((l) =>
      l.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    return (
      <div ref={containerRef} className={`relative flex flex-col gap-2 ${className ?? ''}`}>
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
            <button type="button" onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {selectedName && !isOpen && (
          <p className="text-xs text-brand flex items-center gap-1">
            <MapPin className="h-3 w-3" />{selectedName}
          </p>
        )}
        {isOpen && (
          <div className="absolute z-50 w-full top-11 bg-background border border-border rounded-xl shadow-lg max-h-52 overflow-y-auto">
            {filtered.length === 0
              ? <p className="p-3 text-sm text-muted-foreground text-center">Sin resultados</p>
              : filtered.map((loc) => (
                <button key={loc.id} type="button" onClick={() => handleSelect(loc.id, loc.name)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors ${value === loc.id ? 'bg-brand/10 text-brand font-medium' : 'text-foreground'}`}>
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />{loc.name}
                </button>
              ))
            }
          </div>
        )}
      </div>
    );
  }

  // Provincia CON zonas (Buenos Aires)
  const filtered = localities?.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div ref={containerRef} className={`flex flex-col gap-2 ${className ?? ''}`}>

      {/* Zona */}
      <select
        value={selectedZone}
        onChange={(e) => handleZoneChange(e.target.value)}
        className={selectClass}
        style={{ backgroundImage: chevronBg, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
      >
        <option value="">Seleccioná una zona</option>
        {zones.map((z) => (
          <option key={z} value={z}>{z}</option>
        ))}
      </select>

      {/* Localidad — solo si la zona tiene localidades */}
      {selectedZone && !isZoneWithoutLocalities && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            className={`${inputClass} pl-9 ${selectedName && !isOpen ? 'pr-8' : ''}`}
            placeholder={selectedName || 'Buscar localidad...'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
          />
          {selectedName && !isOpen && (
            <button type="button"
              onClick={() => { setSelectedName(''); setSearch(''); onChange('', '', selectedZone); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-52 overflow-y-auto">
              {isLoading
                ? <p className="p-3 text-sm text-muted-foreground text-center">Cargando...</p>
                : filtered.length === 0
                  ? <p className="p-3 text-sm text-muted-foreground text-center">Sin resultados</p>
                  : filtered.map((loc) => (
                    <button key={loc.id} type="button" onClick={() => handleSelect(loc.id, loc.name)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors ${value === loc.id ? 'bg-brand/10 text-brand font-medium' : 'text-foreground'}`}>
                      <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />{loc.name}
                    </button>
                  ))
              }
            </div>
          )}
        </div>
      )}

      {/* Resumen */}
      {selectedName && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {isZoneWithoutLocalities ? selectedZone : `${selectedZone} · ${selectedName}`}
          </p>
          <button type="button" onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5">
            <X className="h-3 w-3" /> Limpiar
          </button>
        </div>
      )}
    </div>
  );
}

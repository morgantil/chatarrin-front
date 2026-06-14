import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Weight, ShieldCheck } from 'lucide-react';
import { VisibilityBadge } from './VisibilityBadge';
import type { Publication } from '@/types';

function formatPrice(price?: number, isNegotiable?: boolean) {
  if (!price) return isNegotiable ? 'A convenir' : 'Sin precio';
  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
  return isNegotiable ? `${formatted} (neg.)` : formatted;
}

export function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <Link href={`/publicaciones/${pub.id}`} className="group block">
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-brand/30 hover:shadow-sm transition-all duration-200 h-full flex flex-col">

        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
          {pub.photos[0] ? (
            <Image
              src={pub.photos[0]}
              alt={pub.category.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Weight className="h-8 w-8 opacity-20" />
              <span className="text-xs">Sin foto</span>
            </div>
          )}

          {/* Badge visibilidad */}
          <div className="absolute top-2.5 left-2.5">
            <VisibilityBadge visibility={pub.visibility} />
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* Categoría */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
            {pub.category.name}
          </span>

          {/* Título */}
          <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug -mt-1">
            {pub.title || pub.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Weight className="h-3 w-3 shrink-0" />
              {pub.weightKg} kg
            </span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{pub.locality?.name ?? pub.province}</span>
            </span>
          </div>

          {/* Footer: precio + vendedor */}
          <div className="flex items-end justify-between mt-auto pt-3 border-t border-border">
            <p className="text-base font-black text-foreground">
              {formatPrice(pub.priceArs, pub.isNegotiable)}
            </p>
            {pub.seller?.isVerified && (
              <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 dark:text-green-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verificado
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

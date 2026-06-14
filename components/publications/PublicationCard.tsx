import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Weight, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { VisibilityBadge } from './VisibilityBadge';
import type { Publication } from '@/types';

function formatPrice(price?: number, isNegotiable?: boolean) {
  if (!price) return isNegotiable ? 'A convenir' : 'Sin precio';
  const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
  return isNegotiable ? `${formatted} (negociable)` : formatted;
}

export function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <Link href={`/publicaciones/${pub.id}`}>
      <Card className="group overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
        {/* Foto */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {pub.photos[0] ? (
            <Image src={pub.photos[0]} alt={pub.category.name}
              fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Sin foto
            </div>
          )}
          {/* Badge de visibilidad */}
          <div className="absolute top-2 left-2">
            <VisibilityBadge visibility={pub.visibility} />
          </div>
        </div>

        <CardContent className="p-4 flex flex-col gap-2">
          {/* Categoría y verificado */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {pub.category.name}
            </span>
            {pub.seller?.isVerified && (
              <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
            )}
          </div>

          {/* Título */}
          <p className="text-sm font-medium line-clamp-2">{pub.title || pub.description}</p>

          {/* Detalles */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Weight className="h-3 w-3" /> {pub.weightKg} kg
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {pub.seller?.province}
            </span>
          </div>

          {/* Precio */}
          <p className="text-sm font-semibold">
            {formatPrice(pub.priceArs, pub.isNegotiable)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

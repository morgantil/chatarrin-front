'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePublications } from '@/hooks/usePublications';
import { Zap, Star, ArrowRight } from 'lucide-react';
import type { Publication } from '@/types';

function FeaturedCard({ pub }: { pub: Publication }) {
  const isUrgent = pub.visibility === 'URGENT';
  const hasPhoto = pub.photos && pub.photos.length > 0;

  return (
    <Link
      href={`/publicaciones/${pub.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-brand/40 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        {hasPhoto ? (
          <Image
            src={pub.photos[0]}
            alt={pub.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-black text-border/30">CH</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            isUrgent
              ? 'bg-red-500 text-white'
              : 'bg-amber-400 text-amber-900'
          }`}>
            {isUrgent ? <Zap className="h-2.5 w-2.5" /> : <Star className="h-2.5 w-2.5" />}
            {isUrgent ? 'Urgente' : 'Destacado'}
          </span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">{pub.category.name}</p>
        <p className="text-sm font-bold text-foreground line-clamp-2 leading-snug">{pub.title}</p>
        <p className="text-xs text-muted-foreground">{pub.province}</p>
        <p className="text-base font-black text-foreground mt-1">
          {pub.priceArs
            ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(pub.priceArs)
            : pub.isNegotiable ? 'A convenir' : 'Sin precio'}
        </p>
      </div>
    </Link>
  );
}

export function FeaturedPublications() {
  const { data: featured } = usePublications({ visibility: 'FEATURED', limit: 6 });
  const { data: urgent } = usePublications({ visibility: 'URGENT', limit: 6 });

  const combined = [
    ...(urgent?.data ?? []),
    ...(featured?.data ?? []),
  ].slice(0, 6);

  if (combined.length === 0) return null;

  return (
    <section className="py-12 md:py-16 border-t border-border">
      <div className="px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand" />
              Publicaciones destacadas
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Las más urgentes y relevantes del momento</p>
          </div>
          <Link
            href="/publicaciones"
            className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
          >
            Ver todas
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {combined.map((pub) => (
            <FeaturedCard key={pub.id} pub={pub} />
          ))}
        </div>
      </div>
    </section>
  );
}

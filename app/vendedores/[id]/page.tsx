import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Star, MapPin, Package } from 'lucide-react';
import { PublicationCard } from '@/components/publications/PublicationCard';
import { EmptyState } from '@/components/common/EmptyState';

async function getSellerProfile(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/publications/seller/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getSellerReviews(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const seller = await getSellerProfile(id);
  if (!seller) return { title: 'Vendedor no encontrado — Chatarrin' };
  return {
    title: `${seller.name} — Vendedor en Chatarrin`,
    description: `Publicaciones activas de ${seller.name} en ${seller.province}. Marketplace de metales reciclables.`,
    openGraph: {
      title: `${seller.name} en Chatarrin`,
      description: `${seller.publications?.length ?? 0} publicaciones activas en ${seller.province}`,
    },
  };
}

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [seller, reviews] = await Promise.all([
    getSellerProfile(id),
    getSellerReviews(id),
  ]);

  if (!seller) notFound();

  const avgStars = reviews.length
    ? reviews.reduce((s: number, r: any) => s + r.stars, 0) / reviews.length
    : null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 rounded-lg border bg-card">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {seller.avatarUrl ? (
            <Image src={seller.avatarUrl} alt={seller.name}
              width={64} height={64} className="rounded-full object-cover" />
          ) : (
            seller.name[0]
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">{seller.name}</h1>
            {seller.isVerified && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <ShieldCheck className="h-4 w-4" /> Verificado
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" /> {seller.province}
          </div>
          {avgStars && (
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} className={`h-3 w-3 ${n <= Math.round(avgStars)
                  ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                {avgStars.toFixed(1)} ({reviews.length} calificación{reviews.length !== 1 ? 'es' : ''})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Publicaciones activas */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-4 w-4 text-brand" />
          <h2 className="font-semibold">
            Publicaciones activas ({seller.publications?.length ?? 0})
          </h2>
        </div>

        {!seller.publications || seller.publications.length === 0 ? (
          <EmptyState message="Este vendedor no tiene publicaciones activas" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {seller.publications.map((pub: any) => (
              <PublicationCard key={pub.id} pub={pub} />
            ))}
          </div>
        )}
      </div>

      {/* Calificaciones recibidas */}
      {reviews.length > 0 && (
        <div>
          <h2 className="font-semibold mb-4">
            Calificaciones ({reviews.length})
          </h2>
          <div className="flex flex-col gap-3">
            {reviews.slice(0, 5).map((r: any) => (
              <div key={r.id} className="p-3 rounded-lg border bg-card flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.reviewer.name}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((n) => (
                      <Star key={n} className={`h-3 w-3 ${n <= r.stars
                        ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-xs text-muted-foreground italic">"{r.comment}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePublication } from '@/hooks/usePublications';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LogisticsCarousel } from '@/components/logistics/LogisticsCarousel';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { VisibilityBadge } from '@/components/publications/VisibilityBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Weight, Eye, Calendar, MessageCircle, ShieldCheck, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function PublicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pub, isLoading, error } = usePublication(id);
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [paymentMessage, setPaymentMessage] = useState<{
    type: 'success' | 'error' | 'pending';
    text: string;
  } | null>(null);

  // Detectar el resultado del pago cuando MercadoPago redirige de vuelta
  useEffect(() => {
    const pago = searchParams.get('pago');

    if (pago === 'ok') {
      setPaymentMessage({
        type: 'success',
        text: '¡Pago aprobado! Tu publicación ya tiene mayor visibilidad. Puede tardar unos segundos en actualizarse.',
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['publication', id] });
      }, 3000);
    } else if (pago === 'error') {
      setPaymentMessage({
        type: 'error',
        text: 'El pago no pudo procesarse. Podés intentarlo de nuevo desde tu panel.',
      });
    } else if (pago === 'pendiente') {
      setPaymentMessage({
        type: 'pending',
        text: 'El pago está pendiente de confirmación. Te avisaremos cuando se acredite.',
      });
    }
  }, [searchParams, queryClient, id]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !pub) return <p className="text-red-500 text-sm">Publicación no encontrada</p>;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

  const formatPrice = (price?: number, isNegotiable?: boolean) => {
    if (!price) return isNegotiable ? 'A convenir' : 'Sin precio';
    const formatted = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price);
    return isNegotiable ? `${formatted} (negociable)` : formatted;
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Banner de resultado de pago */}
      {paymentMessage && (
        <div className={`p-4 rounded-lg border flex items-start gap-3 ${
          paymentMessage.type === 'success'
            ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
            : paymentMessage.type === 'error'
            ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
            : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
        }`}>
          <span className="text-xl flex-shrink-0">
            {paymentMessage.type === 'success' ? '✅' : paymentMessage.type === 'error' ? '❌' : '⏳'}
          </span>
          <div>
            <p className={`text-sm font-medium ${
              paymentMessage.type === 'success'
                ? 'text-green-700 dark:text-green-300'
                : paymentMessage.type === 'error'
                ? 'text-red-700 dark:text-red-300'
                : 'text-yellow-700 dark:text-yellow-300'
            }`}>
              {paymentMessage.text}
            </p>
            {paymentMessage.type === 'success' && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Podés ver tu publicación actualizada en tu panel.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand">
            {pub.category.name}
          </span>
          <VisibilityBadge visibility={pub.visibility} />
          <Badge variant={pub.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {pub.status === 'ACTIVE' ? 'Activo' : pub.status === 'SOLD' ? 'Vendido' : 'Pausado'}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">{pub.title || pub.description}</h1>
        {pub.title && <p className="text-sm text-muted-foreground">{pub.description}</p>}
      </div>

      {/* Grid: foto + info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fotos */}
        <div className="flex flex-col gap-2">
          {pub.photos[0] ? (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image src={pub.photos[0]} alt={pub.description}
                fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              Sin foto
            </div>
          )}
          {pub.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {pub.photos.slice(1).map((photo, i) => (
                <div key={i} className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <Image src={photo} alt={`Foto ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-3xl font-bold">{formatPrice(pub.priceArs, pub.isNegotiable)}</p>
            <p className="text-sm text-muted-foreground">
              {pub.isNegotiable ? 'Precio negociable' : 'Precio fijo'}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <span>{pub.weightKg} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{pub.province}{pub.locality ? `, ${pub.locality}` : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span>{pub.visitCount} visitas</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(pub.createdAt)}</span>
            </div>
          </div>

          <Separator />

          {/* Vendedor */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Vendedor</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                {pub.seller.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <Link href={`/vendedores/${pub.seller.id}`}
                  className="text-sm font-medium flex items-center gap-1 hover:text-brand transition-colors">
                  {pub.seller.name}
                  {pub.seller.isVerified && <ShieldCheck className="h-3 w-3 text-green-500" />}
                </Link>
                <p className="text-xs text-muted-foreground">{pub.seller.province}</p>
              </div>
            </div>

            {isLoggedIn && pub.seller.whatsapp ? (
              <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white w-fit"
                onClick={() => window.open(`https://wa.me/54${pub.seller.whatsapp}`, '_blank')}>
                <MessageCircle className="h-4 w-4" /> Contactar por WhatsApp
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Iniciá sesión para ver el contacto del vendedor
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Transportistas */}
      <LogisticsCarousel province={pub.province} weightKg={pub.weightKg} />

      {/* Calificaciones */}
      <Separator />
      <ReviewForm sellerId={pub.seller.id} />
    </div>
  );
}

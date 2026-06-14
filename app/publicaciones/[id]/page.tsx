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
import { MapPin, Weight, Eye, Calendar, MessageCircle, ShieldCheck, ArrowLeft, CheckCircle, XCircle, Clock, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

function formatPrice(price?: number, isNegotiable?: boolean) {
  if (!price) return isNegotiable ? 'A convenir' : 'Sin precio';
  const formatted = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
  return isNegotiable ? `${formatted} (neg.)` : formatted;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function PublicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pub, isLoading, error } = usePublication(id);
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [activePhoto, setActivePhoto] = useState(0);
  const [paymentMessage, setPaymentMessage] = useState<{
    type: 'success' | 'error' | 'pending';
    text: string;
  } | null>(null);

  useEffect(() => {
    const pago = searchParams.get('pago');
    if (pago === 'ok') {
      setPaymentMessage({ type: 'success', text: '¡Pago aprobado! Tu publicación ya tiene mayor visibilidad.' });
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['publication', id] }), 3000);
    } else if (pago === 'error') {
      setPaymentMessage({ type: 'error', text: 'El pago no pudo procesarse. Podés intentarlo de nuevo desde tu panel.' });
    } else if (pago === 'pendiente') {
      setPaymentMessage({ type: 'pending', text: 'El pago está pendiente de confirmación. Te avisaremos cuando se acredite.' });
    }
  }, [searchParams, queryClient, id]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !pub) return (
    <div className="max-w-4xl mx-auto py-16 text-center">
      <p className="text-muted-foreground">Publicación no encontrada.</p>
      <Link href="/publicaciones" className="text-brand text-sm hover:underline mt-2 inline-block">
        ← Volver al listado
      </Link>
    </div>
  );

  const paymentStyles = {
    success: { bg: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800', text: 'text-green-700 dark:text-green-400', Icon: CheckCircle },
    error:   { bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',     text: 'text-red-700 dark:text-red-400',     Icon: XCircle },
    pending: { bg: 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800', text: 'text-yellow-700 dark:text-yellow-400', Icon: Clock },
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-2">

      {/* Resultado de pago */}
      {paymentMessage && (() => {
        const s = paymentStyles[paymentMessage.type];
        return (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${s.bg}`}>
            <s.Icon className={`h-5 w-5 shrink-0 mt-0.5 ${s.text}`} />
            <p className={`text-sm font-medium ${s.text}`}>{paymentMessage.text}</p>
          </div>
        );
      })()}

      {/* Back */}
      <Link
        href="/publicaciones"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Publicaciones
      </Link>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

        {/* Columna fotos */}
        <div className="flex flex-col gap-2">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
            {pub.photos[activePhoto] ? (
              <Image
                src={pub.photos[activePhoto]}
                alt={pub.description}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                Sin foto
              </div>
            )}
            <div className="absolute top-3 left-3">
              <VisibilityBadge visibility={pub.visibility} />
            </div>
          </div>

          {pub.photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {pub.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === activePhoto ? 'border-brand' : 'border-transparent hover:border-border'
                  }`}
                >
                  <Image src={photo} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna info */}
        <div className="flex flex-col gap-5">

          {/* Categoría + estado */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand">
              {pub.category.name}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
              pub.status === 'ACTIVE'
                ? 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/40 dark:border-green-800'
                : 'text-muted-foreground bg-secondary border-border'
            }`}>
              {pub.status === 'ACTIVE' ? 'Activo' : pub.status === 'SOLD' ? 'Vendido' : 'Pausado'}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-xl font-black text-foreground leading-tight">
            {pub.title || pub.description}
          </h1>
          {pub.title && (
            <p className="text-sm text-muted-foreground -mt-3 leading-relaxed">{pub.description}</p>
          )}

          {/* Precio */}
          <div className="bg-secondary rounded-2xl p-4 border border-border">
            <p className="text-3xl font-black text-foreground">
              {formatPrice(pub.priceArs, pub.isNegotiable)}
            </p>
            {pub.isNegotiable && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                Precio negociable
              </p>
            )}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Weight,   label: 'Peso',       value: `${pub.weightKg} kg` },
              { icon: MapPin,   label: 'Ubicación',  value: `${pub.province}${pub.locality ? `, ${pub.locality}` : ''}` },
              { icon: Eye,      label: 'Visitas',    value: `${pub.visitCount}` },
              { icon: Calendar, label: 'Publicado',  value: formatDate(pub.createdAt) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-secondary rounded-xl p-3 border border-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">{label}</span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">{value}</p>
              </div>
            ))}
          </div>

          {/* Vendedor */}
          <div className="border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-base font-black text-brand shrink-0">
              {pub.seller.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/vendedores/${pub.seller.id}`}
                className="text-sm font-bold text-foreground hover:text-brand transition-colors flex items-center gap-1.5"
              >
                {pub.seller.name}
                {pub.seller.isVerified && (
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                )}
              </Link>
              <p className="text-xs text-muted-foreground">{pub.seller.province}</p>
            </div>
            <Link
              href={`/vendedores/${pub.seller.id}`}
              className="text-xs text-brand font-medium hover:underline shrink-0"
            >
              Ver perfil →
            </Link>
          </div>

          {/* Contacto */}
          {isLoggedIn ? (
            pub.seller.whatsapp ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    const msg = encodeURIComponent(`Hola, vi tu publicación de ${pub.title} en Chatarrin, ¿sigue disponible?`);
                    window.open(`https://wa.me/54${pub.seller.whatsapp}?text=${msg}`, '_blank');
                  }}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 rounded-full text-sm transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contactar por WhatsApp
                </button>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    const msg = encodeURIComponent(`Mirá esta publicación en Chatarrin: ${pub.title} — ${url}`);
                    window.open(`https://wa.me/?text=${msg}`, '_blank');
                  }}
                  className="flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 font-medium py-2.5 rounded-full text-sm transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Compartir
                </button>
              </div>
            ) : null
          ) : (
            <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-secondary">
              <p className="text-sm text-muted-foreground text-center">
                Iniciá sesión para ver el contacto del vendedor
              </p>
              <Link
                href="/login"
                className="flex items-center justify-center bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 rounded-full text-sm transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Carrusel de transportistas */}
      <div className="border-t border-border pt-8">
        <LogisticsCarousel province={pub.province} weightKg={pub.weightKg} />
      </div>

      {/* Calificaciones */}
      <div className="border-t border-border pt-8">
        <h3 className="font-bold text-base text-foreground mb-4">Calificar al vendedor</h3>
        <ReviewForm sellerId={pub.seller.id} />
      </div>

    </div>
  );
}

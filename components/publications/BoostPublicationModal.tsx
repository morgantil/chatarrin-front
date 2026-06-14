'use client';

import { useState } from 'react';
import { usePrices, useCheckout } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { X, Zap, Star, TrendingUp, Check } from 'lucide-react';

// Íconos y colores por nivel de visibilidad
const VISIBILITY_CONFIG = {
  NORMAL: {
    icon: TrendingUp,
    color: 'text-blue-500',
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-950',
    badge: 'bg-secondary text-secondary-foreground',
  },
  FEATURED: {
    icon: Star,
    color: 'text-accent',
    border: 'border-yellow-200 dark:border-yellow-800',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    badge: 'bg-accent text-black',
  },
  URGENT: {
    icon: Zap,
    color: 'text-brand',
    border: 'border-orange-200 dark:border-orange-800',
    bg: 'bg-orange-50 dark:bg-orange-950',
    badge: 'bg-brand text-white',
  },
};

interface Props {
  publicationId: string;
  publicationTitle: string;
  currentVisibility: string;
  onClose: () => void;
}

export function BoostPublicationModal({
  publicationId,
  publicationTitle,
  currentVisibility,
  onClose,
}: Props) {
  const { data: prices, isLoading: loadingPrices } = usePrices();
  const checkout = useCheckout();
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handlePagar = async () => {
    if (!selected) return;

    try {
      setError('');
      const res = await checkout.mutateAsync({
        publicationId,
        visibility: selected,
      });

      // Redirigir a MercadoPago
      window.location.href = res.checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar el pago. Intentá de nuevo.');
    }
  };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div className="bg-background rounded-xl border shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Destacar publicación</h2>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
              {publicationTitle}
            </p>
          </div>
          <button onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 flex flex-col gap-4">

          {loadingPrices ? (
            <LoadingSpinner />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Elegí el nivel de visibilidad. El pago se procesa de forma segura con MercadoPago.
              </p>

              {/* Opciones de visibilidad */}
              <div className="flex flex-col gap-3">
                {prices?.map((price) => {
                  const config = VISIBILITY_CONFIG[price.visibility as keyof typeof VISIBILITY_CONFIG];
                  const Icon = config.icon;
                  const isSelected = selected === price.visibility;
                  const isCurrent = currentVisibility === price.visibility;

                  return (
                    <button
                      key={price.visibility}
                      onClick={() => !isCurrent && setSelected(price.visibility)}
                      disabled={isCurrent}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isCurrent
                          ? 'border-border opacity-50 cursor-not-allowed'
                          : isSelected
                          ? `${config.border} ${config.bg}`
                          : 'border-border hover:border-muted-foreground'
                      }`}>

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-brand border-brand'
                              : 'border-muted-foreground'
                          }`}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${config.color}`} />
                              <span className="font-semibold text-sm">{price.label}</span>
                              {isCurrent && (
                                <span className="text-xs text-muted-foreground">(plan actual)</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {price.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Duración: {price.durationDays} días
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm">{formatPrice(price.priceArs)}</p>
                          <p className="text-xs text-muted-foreground">ARS</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Info de seguridad */}
              <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                <p>
                  🔒 El pago se procesa de forma segura a través de MercadoPago.
                  Aceptamos tarjetas de crédito, débito y transferencias bancarias.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handlePagar}
            disabled={!selected || checkout.isPending}
            className="flex-1 bg-brand hover:bg-brand-dark text-white">
            {checkout.isPending ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Procesando...
              </span>
            ) : (
              'Ir a pagar'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

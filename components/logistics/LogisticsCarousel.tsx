'use client';

import { useLogisticsCarousel } from '@/hooks/useLogistics';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, MessageCircle } from 'lucide-react';
import { VisibilityBadge } from '@/components/publications/VisibilityBadge';

interface Props {
  province: string;
  weightKg: number;
}

export function LogisticsCarousel({ province, weightKg }: Props) {
  const { data: logistics, isLoading } = useLogisticsCarousel(province, weightKg);
  const { isLoggedIn } = useAuth();

  if (isLoading || !logistics || logistics.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 text-brand" />
        <h3 className="font-semibold text-sm">Transportistas disponibles en {province}</h3>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
        {logistics.map((l) => (
          <Card key={l.id} className="flex-shrink-0 w-64 snap-start">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm truncate">
                  {l.companyName || l.user.name}
                </p>
                <VisibilityBadge visibility={l.visibility as any} />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">{l.description}</p>

              {isLoggedIn && l.user.whatsapp ? (
                <Button size="sm" variant="outline"
                  className="gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  onClick={() => window.open(`https://wa.me/54${l.user.whatsapp}`, '_blank')}>
                  <MessageCircle className="h-3 w-3" /> Contactar
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Iniciá sesión para ver el contacto
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

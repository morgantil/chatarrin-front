'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, Truck, Star } from 'lucide-react';
import Link from 'next/link';

export default function PanelPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Mi panel</h1>
          <p className="text-sm text-muted-foreground">
            Bienvenido, {user?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Publicar */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
              <Plus className="h-8 w-8 text-brand" />
              <p className="font-semibold">Crear publicación</p>
              <p className="text-xs text-muted-foreground">
                Publicá material reciclable para vender
              </p>
              <Button size="sm" className="bg-brand hover:bg-brand-dark text-white mt-2" asChild>
                <Link href="/panel/publicar">Publicar</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Mis publicaciones */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
              <Package className="h-8 w-8 text-brand" />
              <p className="font-semibold">Mis publicaciones</p>
              <p className="text-xs text-muted-foreground">
                Administrá tus lotes activos, vendidos o pausados
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/panel/publicaciones">Ver</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Transportista */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
              <Truck className="h-8 w-8 text-brand" />
              <p className="font-semibold">Perfil transportista</p>
              <p className="text-xs text-muted-foreground">
                Configurá tu perfil y zonas de cobertura
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/panel/logistica">Editar</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Calificaciones */}
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col gap-3 items-center text-center">
              <Star className="h-8 w-8 text-brand" />
              <p className="font-semibold">Calificaciones</p>
              <p className="text-xs text-muted-foreground">
                Reseñas recibidas y enviadas
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/panel/calificaciones">Ver</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import type { LogisticsProfile } from '@/types';

const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

const profileSchema = z.object({
  companyName: z.string().optional(),
  description: z.string().min(10, 'Describí tu servicio (mín. 10 caracteres)'),
  coverageProvinces: z.array(z.string()).min(1, 'Seleccioná al menos una provincia'),
  visibility: z.enum(['FREE', 'NORMAL', 'FEATURED']),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function LogisticsProfilePage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['my-logistics-profile'],
    queryFn: () => api.get<LogisticsProfile>('/api/logistics/my-profile'),
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } =
    useForm<ProfileForm>({
      resolver: zodResolver(profileSchema) as any,
      values: profile ? {
        companyName: profile.companyName || '',
        description: profile.description,
        coverageProvinces: profile.coverageProvinces,
        visibility: profile.visibility as any,
      } : undefined,
    });

  const onSubmit = async (data: ProfileForm) => {
    try {
      setError('');
      setSuccess(false);
      if (profile) {
        await api.put('/api/logistics/profile', data);
      } else {
        await api.post('/api/logistics/profile', data);
      }
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['my-logistics-profile'] });
    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Perfil de transportista</h1>

        {loadingProfile ? (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre de empresa (opcional)</Label>
              <Input placeholder="Mi Transporte SRL" {...register('companyName')} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Descripción del servicio</Label>
              <Textarea rows={3}
                placeholder="Describí qué tipo de transporte ofrecés, capacidad, etc."
                {...register('description')} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Provincias de cobertura</Label>
              <Controller name="coverageProvinces" control={control} render={({ field }) => (
                <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto border rounded-md p-2">
                  {PROVINCES.map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(p) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...(field.value || []), p]);
                          } else {
                            field.onChange(field.value?.filter((v: string) => v !== p) || []);
                          }
                        }}
                        className="rounded border-border"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              )} />
              {errors.coverageProvinces && <p className="text-xs text-red-500">{errors.coverageProvinces.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Visibilidad</Label>
              <Controller name="visibility" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Nivel de visibilidad" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">Gratis</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="FEATURED">Destacado</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600 font-medium">Perfil guardado correctamente</p>}

            <Button type="submit" disabled={isSubmitting}
              className="bg-brand hover:bg-brand-dark text-white w-full">
              {isSubmitting ? 'Guardando...' : profile ? 'Actualizar perfil' : 'Crear perfil'}
            </Button>

            {profile && (
              <Button type="button" variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => {
                  if (confirm('¿Eliminar tu perfil de transportista?')) {
                    api.delete('/api/logistics/profile')
                      .then(() => {
                        queryClient.invalidateQueries({ queryKey: ['my-logistics-profile'] });
                        toast.success('Perfil eliminado');
                      })
                      .catch(() => toast.error('Error al eliminar el perfil'));
                  }
                }}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar perfil
              </Button>
            )}
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}

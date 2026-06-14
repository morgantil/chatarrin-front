'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/common/ImageUploader';
import { useState } from 'react';
import { useCategories } from '@/hooks/usePublications';

const createSchema = z.object({
  categoryId: z.string().min(1, 'Seleccioná una categoría'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'Describí el material (mín. 10 caracteres)'),
  weightKg: z.number().positive('El peso debe ser mayor a 0'),
  priceArs: z.number().optional(),
  isNegotiable: z.boolean(),
  province: z.string().min(1, 'Seleccioná tu provincia'),
  locality: z.string().optional(),
  visibility: z.enum(['FREE', 'NORMAL', 'FEATURED', 'URGENT']),
});

type CreateForm = z.infer<typeof createSchema>;

const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

export default function CreatePublicationPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const [error, setError] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } =
    useForm<CreateForm>({
      resolver: zodResolver(createSchema) as any,
      defaultValues: {
        isNegotiable: false,
        visibility: 'NORMAL',
      },
    });

  const onSubmit = async (data: CreateForm) => {
    try {
      setError('');
      await api.post('/api/publications', {
        ...data,
        weightKg: Number(data.weightKg),
        priceArs: data.priceArs ? Number(data.priceArs) : undefined,
        photos: photoUrls,
      });
      router.push('/panel/publicaciones');
    } catch (err: any) {
      setError(err.message || 'Error al crear la publicación');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Nueva publicación</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Categoría</Label>
            <Controller name="categoryId" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Seleccioná el material" /></SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
            {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Título</Label>
            <Input placeholder="Ej: Aluminio post-consumo, Bronce industrial..." {...register('title')} />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Descripción</Label>
            <Textarea rows={3} placeholder="Describí el material, estado, cantidad..." {...register('description')} />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Peso (kg)</Label>
              <Input type="number" step="0.1" min="0" placeholder="100"
                {...register('weightKg', { valueAsNumber: true })} />
              {errors.weightKg && <p className="text-xs text-red-500">{errors.weightKg.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Precio (ARS, opcional)</Label>
              <Input type="number" placeholder="50000"
                {...register('priceArs', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isNegotiable" {...register('isNegotiable')} className="rounded border-border" />
            <Label htmlFor="isNegotiable" className="text-sm">Precio negociable</Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Provincia</Label>
              <Controller name="province" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Provincia" /></SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
              {errors.province && <p className="text-xs text-red-500">{errors.province.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Localidad (opcional)</Label>
              <Input placeholder="Localidad" {...register('locality')} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Visibilidad</Label>
            <Controller name="visibility" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger><SelectValue placeholder="Nivel de visibilidad" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Gratis (básica)</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="FEATURED">Destacado</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Fotos (opcional, máx 5)</Label>
            <ImageUploader onChange={setPhotoUrls} maxFiles={5} />
            <p className="text-xs text-muted-foreground">
              La primera foto aparece en el listado.
            </p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={isSubmitting}
            className="bg-brand hover:bg-brand-dark text-white w-full">
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </Button>
        </form>
      </div>
    </ProtectedRoute>
  );
}

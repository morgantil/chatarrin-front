'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/common/ImageUploader';
import { useState } from 'react';
import { useCategories } from '@/hooks/usePublications';
import { LocalitySelector } from '@/components/common/LocalitySelector';

const createSchema = z.object({
  categoryId: z.string().min(1, 'Seleccioná una categoría'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'Describí el material (mín. 10 caracteres)'),
  weightKg: z.number().positive('El peso debe ser mayor a 0'),
  priceArs: z.number().min(0).optional(),
  isNegotiable: z.boolean(),
  province: z.string().min(1, 'Seleccioná tu provincia'),
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

const selectClass = "flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand appearance-none cursor-pointer";

export default function CreatePublicationPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const [error, setError] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [localityId, setLocalityId] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CreateForm>({
      resolver: zodResolver(createSchema) as any,
      defaultValues: { isNegotiable: false, visibility: 'NORMAL' },
    });

  const onSubmit = async (data: CreateForm) => {
    try {
      setError('');
      await api.post('/api/publications', {
        ...data,
        weightKg: Number(data.weightKg),
        priceArs: data.priceArs ? Number(data.priceArs) : undefined,
        photos: photoUrls,
        localityId: localityId || undefined,
      });
      router.push('/panel/publicaciones');
    } catch (err: any) {
      setError(err.message || 'Error al crear la publicación');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-lg mx-auto flex flex-col gap-6 py-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Nueva publicación</h1>
          <p className="text-sm text-muted-foreground mt-1">Completá los datos de tu material</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {/* Categoría */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Categoría</Label>
            <select className={selectClass} {...register('categoryId')}>
              <option value="">Seleccioná el material</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
          </div>

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Título</Label>
            <Input
              placeholder="Ej: Aluminio post-consumo, Bronce industrial..."
              className="h-10 rounded-xl"
              {...register('title')}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Descripción</Label>
            <Textarea
              rows={3}
              placeholder="Describí el material, estado, cantidad..."
              className="rounded-xl resize-none"
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Peso + Precio */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold">Peso (kg)</Label>
              <Input
                type="number" step="0.1" min="0" placeholder="100"
                className="h-10 rounded-xl"
                {...register('weightKg', { valueAsNumber: true })}
              />
              {errors.weightKg && <p className="text-xs text-red-500">{errors.weightKg.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-semibold">Precio ARS</Label>
              <Input
                type="number" min="0" step="1" placeholder="Opcional"
                className="h-10 rounded-xl"
                {...register('priceArs', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Precio negociable */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border accent-brand"
              {...register('isNegotiable')}
            />
            <span className="text-sm font-medium text-foreground">Precio negociable</span>
          </label>

          {/* Provincia */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Provincia</Label>
            <select
              className={selectClass}
              {...register('province')}
              onChange={(e) => {
                register('province').onChange(e);
                setSelectedProvince(e.target.value);
                setLocalityId('');
              }}
            >
              <option value="">Seleccioná tu provincia</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.province && <p className="text-xs text-red-500">{errors.province.message}</p>}
          </div>

          {/* Localidad */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">
              Localidad <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <LocalitySelector
              province={selectedProvince}
              value={localityId}
              onChange={(id) => setLocalityId(id)}
              placeholder="Buscar localidad..."
            />
          </div>

          {/* Visibilidad */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Visibilidad</Label>
            <select className={selectClass} {...register('visibility')}>
              <option value="FREE">Gratis (básica)</option>
              <option value="NORMAL">Normal</option>
              <option value="FEATURED">Destacado</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>

          {/* Fotos */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">
              Fotos <span className="text-muted-foreground font-normal">(opcional, máx 5)</span>
            </Label>
            <ImageUploader onChange={setPhotoUrls} maxFiles={5} />
            <p className="text-xs text-muted-foreground">La primera foto aparece en el listado.</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full bg-brand hover:bg-brand-dark text-white font-semibold rounded-full text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}

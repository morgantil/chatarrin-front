'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterForm } from '@/lib/validations';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import type { AuthResponse } from '@/types';
import { LocalitySelector } from '@/components/common/LocalitySelector';

const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

export default function RegisterPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [localityId, setLocalityId] = useState('');

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } =
    useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      const res = await api.post<AuthResponse>('/api/auth/register', {
        ...data,
        localityId: localityId || undefined,
      });
      setAuth(res.user, res.token);
      router.push('/publicaciones');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* Header */}
        <div className="text-center flex flex-col gap-1">
          <Link href="/" className="flex items-center justify-center gap-0 mb-4">
            <span className="text-2xl font-black tracking-tight text-foreground">chatar</span>
            <span className="text-2xl font-black tracking-tight text-brand">rin</span>
          </Link>
          <h1 className="text-xl font-black text-foreground">Crear cuenta gratis</h1>
          <p className="text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-brand hover:text-brand-dark font-semibold transition-colors">
              Iniciá sesión
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Nombre completo</Label>
            <Input
              placeholder="Juan Pérez"
              className="h-11 rounded-xl border-border bg-card"
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Email</Label>
            <Input
              type="email"
              placeholder="juan@email.com"
              className="h-11 rounded-xl border-border bg-card"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">WhatsApp</Label>
            <Input
              placeholder="1134567890"
              className="h-11 rounded-xl border-border bg-card"
              {...register('whatsapp')}
            />
            {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Contraseña</Label>
            <Input
              type="password"
              className="h-11 rounded-xl border-border bg-card"
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Provincia</Label>
            <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(v) => { field.onChange(v); setSelectedProvince(v); setLocalityId(''); }}
                  value={field.value || ''}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border bg-card">
                    <SelectValue placeholder="Seleccioná tu provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.province && <p className="text-xs text-red-500">{errors.province.message}</p>}
          </div>

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

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full bg-brand hover:bg-brand-dark active:bg-brand-dark text-white font-semibold rounded-full text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Al registrarte aceptás nuestros términos de uso y privacidad.
          </p>
        </form>
      </div>
    </div>
  );
}

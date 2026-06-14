'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '@/lib/validations';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import type { AuthResponse } from '@/types';

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const res = await api.post<AuthResponse>('/api/auth/login', data);
      setAuth(res.user, res.token);
      router.push('/publicaciones');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
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
          <h1 className="text-xl font-black text-foreground">Bienvenido de vuelta</h1>
          <p className="text-sm text-muted-foreground">
            ¿No tenés cuenta?{' '}
            <Link href="/registro" className="text-brand hover:text-brand-dark font-semibold transition-colors">
              Registrate gratis
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="whatsapp" className="text-sm font-semibold">WhatsApp</Label>
            <Input
              id="whatsapp"
              placeholder="1134567890"
              className="h-11 rounded-xl border-border bg-card focus:ring-brand focus:border-brand"
              {...register('whatsapp')}
            />
            {errors.whatsapp && (
              <p className="text-xs text-red-500">{errors.whatsapp.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-sm font-semibold">Contraseña</Label>
            <Input
              id="password"
              type="password"
              className="h-11 rounded-xl border-border bg-card focus:ring-brand focus:border-brand"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
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
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Role } from '@/types';

export function useAuth() {
  const { user, token, isLoading, clearAuth } = useAuthStore();
  const isLoggedIn = !!token && !!user;

  return { user, token, isLoggedIn, isLoading, clearAuth };
}

export function useRequireAuth(allowedRoles?: Role[]) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/');
    }
  }, [isLoggedIn, isLoading, user, allowedRoles, router]);

  return { user, isLoggedIn, isLoading };
}

'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';
import type { Role } from '@/types';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isLoading, isLoggedIn } = useRequireAuth(allowedRoles);

  if (isLoading) return <LoadingSpinner />;
  if (!isLoggedIn) return null;

  return <>{children}</>;
}

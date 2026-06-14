'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, User, LogOut, LayoutDashboard, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  const publishHref = user ? '/panel/publicar' : '/registro';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 shrink-0">
          <span className="text-lg font-black tracking-tight text-foreground">chatar</span>
          <span className="text-lg font-black tracking-tight text-brand">rin</span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/publicaciones"
            className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
          >
            Publicaciones
          </Link>
        </nav>

        {/* Acciones — desktop */}
        <div className="flex items-center gap-2">
          {/* Toggle tema */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>

          {/* CTA Publicar — siempre visible */}
          <Button
            size="sm"
            className="hidden sm:flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-full px-4 h-8 text-sm"
            onClick={() => router.push(publishHref)}
          >
            <Plus className="h-3.5 w-3.5" />
            Publicar gratis
          </Button>

          {/* Usuario autenticado */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-muted transition-colors border border-border outline-none">
                <span className="text-xs font-bold text-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/panel')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Mi panel
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <ShieldCheck className="mr-2 h-4 w-4" /> Administración
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-sm font-medium"
                onClick={() => router.push('/login')}
              >
                Iniciar sesión
              </Button>
            </div>
          )}

          {/* Menú mobile */}
          <Sheet>
            <SheetTrigger className="md:hidden flex items-center justify-center h-8 w-8 rounded-md hover:bg-secondary transition-colors">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Menú</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-10">
              <div className="flex flex-col gap-1">
                <Link
                  href="/publicaciones"
                  className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary transition-colors"
                >
                  Publicaciones
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/panel"
                      className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary transition-colors"
                    >
                      Mi panel
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary transition-colors"
                      >
                        Administración
                      </Link>
                    )}
                  </>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                <Button
                  className="bg-brand hover:bg-brand-dark text-white font-semibold w-full rounded-full"
                  onClick={() => router.push(publishHref)}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Publicar gratis
                </Button>
                {!user && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/login')}
                  >
                    Iniciar sesión
                  </Button>
                )}
                {user && (
                  <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

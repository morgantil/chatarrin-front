import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-6xl font-bold text-brand">404</h1>
      <p className="text-lg text-muted-foreground">Página no encontrada</p>
      <Button asChild className="bg-brand hover:bg-brand-dark text-white">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}

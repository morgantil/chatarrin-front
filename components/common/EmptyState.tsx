import { PackageOpen } from 'lucide-react';

export function EmptyState({ message = 'No hay resultados' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <PackageOpen className="h-12 w-12" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

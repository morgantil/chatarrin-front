import { Badge } from '@/components/ui/badge';

const CONFIG = {
  URGENT:   { label: 'URGENTE',   className: 'bg-brand text-white border-0' },
  FEATURED: { label: 'DESTACADO', className: 'bg-accent text-black border-0' },
  NORMAL:   { label: 'Normal',    className: 'bg-secondary text-secondary-foreground' },
  FREE:     { label: '',          className: '' },
};

export function VisibilityBadge({ visibility }: { visibility: keyof typeof CONFIG }) {
  const cfg = CONFIG[visibility];
  if (!cfg.label) return null;
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
}

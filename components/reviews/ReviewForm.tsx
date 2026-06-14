'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  sellerId: string;
}

export function ReviewForm({ sellerId }: Props) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!stars) return;
    try {
      setLoading(true);
      setError('');
      await api.post(`/api/reviews/${sellerId}`, { stars, comment });
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['seller', sellerId] });
    } catch (err: any) {
      setError(err.message || 'Error al enviar la calificación');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <p className="text-sm text-green-600 font-medium">¡Calificación enviada! Gracias.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Calificar a este vendedor</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setStars(n)}>
            <Star className={`h-6 w-6 transition-colors ${
              n <= (hover || stars) ? 'fill-accent text-accent' : 'text-muted-foreground'
            }`} />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Comentario opcional..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="resize-none text-sm"
        rows={3}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button size="sm" disabled={!stars || loading} onClick={handleSubmit}
        className="bg-brand hover:bg-brand-dark text-white w-fit">
        {loading ? 'Enviando...' : 'Enviar calificación'}
      </Button>
    </div>
  );
}

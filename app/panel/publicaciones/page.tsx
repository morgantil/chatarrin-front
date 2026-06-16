'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUploader } from '@/components/common/ImageUploader';
import { Eye, Pause, Play, CheckCircle2, AlertCircle, Edit3, X, Save, Trash2, Sparkles } from 'lucide-react';
import { BoostPublicationModal } from '@/components/publications/BoostPublicationModal';
import { toast } from 'sonner';
import type { Publication, Category } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  SOLD: 'bg-gray-100 text-gray-500',
};

const VISIBILITY_LABELS: Record<string, string> = {
  FREE: 'Gratuita',
  NORMAL: 'Normal',
  FEATURED: 'Destacada',
  URGENT: 'Urgente',
};

function daysRemaining(expiresAt?: string): string | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return 'Vencida';
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days === 1 ? '1 día' : `${days} días`;
}

interface EditForm {
  title: string;
  description: string;
  weightKg: string;
  priceArs: string;
  isNegotiable: boolean;
  province: string;
  locality: string;
  categoryId: string;
  photos: string[];
}

export default function MyPublicationsPage() {
  const queryClient = useQueryClient();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'PAUSED' | 'ACTIVE' | 'SOLD' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    title: '', description: '', weightKg: '', priceArs: '', isNegotiable: false,
    province: '', locality: '', categoryId: '', photos: [],
  });
  const [newPhotoUrls, setNewPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [boosting, setBoosting] = useState<{
    id: string;
    title: string;
    visibility: string;
  } | null>(null);

  const { data: publications, isLoading } = useQuery({
    queryKey: ['my-publications'],
    queryFn: () => api.get<Publication[]>('/api/publications/my/list'),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/api/categories'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/publications/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-publications'] });
      setConfirmingId(null);
      setConfirmAction(null);
      toast.success('Estado actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar estado');
      setConfirmingId(null);
      setConfirmAction(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EditForm> }) =>
      api.put(`/api/publications/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-publications'] });
      setEditingId(null);
      toast.success('Publicación actualizada');
    },
    onError: () => toast.error('Error al actualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/publications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-publications'] });
      toast.success('Publicación eliminada');
    },
    onError: () => toast.error('Error al eliminar'),
  });

  const openEdit = (pub: Publication) => {
    setEditForm({
      title: pub.title ?? '',
      description: pub.description,
      weightKg: String(pub.weightKg),
      priceArs: pub.priceArs ? String(pub.priceArs) : '',
      isNegotiable: pub.isNegotiable,
      province: pub.province,
      locality: pub.locality?.name ?? '',
      categoryId: pub.category.id,
      photos: pub.photos,
    });
    setEditingId(pub.id);
  };

  const saveEdit = () => {
    if (!editingId) return;

    const allPhotos = [...editForm.photos, ...newPhotoUrls];

    const data: any = {
      title: editForm.title,
      description: editForm.description,
      weightKg: parseFloat(editForm.weightKg),
      isNegotiable: editForm.isNegotiable,
      province: editForm.province,
      locality: editForm.locality || undefined,
      categoryId: editForm.categoryId,
      photos: allPhotos,
    };
    if (editForm.priceArs) data.priceArs = parseFloat(editForm.priceArs);
    updateMutation.mutate({ id: editingId, data });
  };

  const confirmActionLabel = (action: 'PAUSED' | 'ACTIVE' | 'SOLD'): string => {
    if (action === 'PAUSED') return 'pausar';
    if (action === 'ACTIVE') return 'reactivar';
    return 'marcar como vendida';
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Mis publicaciones</h1>

        {isLoading ? (
          <LoadingSpinner />
        ) : !publications || publications.length === 0 ? (
          <EmptyState message="Todavía no publicaste ningún lote" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Publicación</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Visibilidad</th>
                  <th className="pb-3 font-medium text-center">Visitas</th>
                  <th className="pb-3 font-medium">Vence</th>
                  <th className="pb-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {publications.map((pub) => {
                  const remaining = daysRemaining(pub.expiresAt);
                  return (
                    <tr key={pub.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          {pub.photos?.[0] && (
                            <img
                              src={pub.photos[0]}
                              alt=""
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium truncate max-w-[200px]">
                              {pub.title || pub.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {pub.weightKg} kg — {pub.province}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={STATUS_COLORS[pub.status]}>
                          {pub.status === 'ACTIVE' ? 'Activa' : pub.status === 'PAUSED' ? 'Pausada' : 'Vendida'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <span className="text-muted-foreground">
                          {VISIBILITY_LABELS[pub.visibility] ?? pub.visibility}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" />
                          {pub.visitCount}
                        </span>
                      </td>
                      <td className="py-3">
                        {remaining ? (
                          <span className={remaining === 'Vencida' ? 'text-red-500 text-xs' : 'text-xs text-muted-foreground'}>
                            {remaining === 'Vencida' && <AlertCircle className="h-3 w-3 inline mr-1" />}
                            {remaining}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        {confirmingId === pub.id && confirmAction ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs text-muted-foreground mr-1">
                              ¿{confirmActionLabel(confirmAction)}?
                            </span>
                            <Button size="sm" variant="outline" className="h-7 text-xs"
                              onClick={() => statusMutation.mutate({ id: pub.id, status: confirmAction })}
                              disabled={statusMutation.isPending}>
                              Sí
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs"
                              onClick={() => { setConfirmingId(null); setConfirmAction(null); }}>
                              No
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="ghost" className="h-7 text-xs"
                              onClick={() => openEdit(pub)}>
                              <Edit3 className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-600"
                              onClick={() => {
                                if (confirm('¿Eliminar esta publicación?')) {
                                  deleteMutation.mutate(pub.id);
                                }
                              }}>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                            {pub.status === 'ACTIVE' && (
                              <>
                                <Button size="sm" variant="ghost" className="h-7 text-xs"
                                  onClick={() => { setConfirmingId(pub.id); setConfirmAction('PAUSED'); }}>
                                  <Pause className="h-3 w-3 mr-1" />
                                  Pausar
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-600"
                                  onClick={() => { setConfirmingId(pub.id); setConfirmAction('SOLD'); }}>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Vendida
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-brand text-brand hover:bg-brand hover:text-white transition-colors"
                                  onClick={() => setBoosting({
                                    id: pub.id,
                                    title: pub.title || pub.description,
                                    visibility: pub.visibility,
                                  })}>
                                  <Sparkles className="h-3 w-3" />
                                  Destacar
                                </Button>
                              </>
                            )}
                            {pub.status === 'PAUSED' && (
                              <Button size="sm" variant="ghost" className="h-7 text-xs"
                                onClick={() => { setConfirmingId(pub.id); setConfirmAction('ACTIVE'); }}>
                                <Play className="h-3 w-3 mr-1" />
                                Reactivar
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de pago — Destacar publicación */}
        {boosting && (
          <BoostPublicationModal
            publicationId={boosting.id}
            publicationTitle={boosting.title}
            currentVisibility={boosting.visibility}
            onClose={() => setBoosting(null)}
          />
        )}

        {/* Modal de edición */}
        {editingId && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Editar publicación</h2>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Descripción</Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Peso (kg)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editForm.weightKg}
                        onChange={(e) => setEditForm({ ...editForm, weightKg: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Precio (ARS)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editForm.priceArs}
                        onChange={(e) => setEditForm({ ...editForm, priceArs: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="negotiable"
                      checked={editForm.isNegotiable}
                      onChange={(e) => setEditForm({ ...editForm, isNegotiable: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="negotiable" className="text-sm">Precio negociable</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Provincia</Label>
                      <Input
                        value={editForm.province}
                        onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Localidad</Label>
                      <Input
                        value={editForm.locality}
                        onChange={(e) => setEditForm({ ...editForm, locality: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Fotos actuales */}
                  {editForm.photos.length > 0 && (
                    <div>
                      <Label>Fotos actuales</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {editForm.photos.map((url, i) => (
                          <div key={url} className="relative group w-16 h-16 rounded overflow-hidden bg-muted">
                            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setEditForm({ ...editForm, photos: editForm.photos.filter((_, idx) => idx !== i) })}
                              className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subir fotos nuevas */}
                  <div>
                    <Label>Agregar fotos</Label>
                    <div className="mt-1">
                      <ImageUploader onChange={(urls) => setNewPhotoUrls(urls)} maxFiles={5 - editForm.photos.length} />
                    </div>
                  </div>

                  <div>
                    <Label>Categoría</Label>
                    <Select
                      value={editForm.categoryId}
                      onValueChange={(v) => setEditForm({ ...editForm, categoryId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                  <Button onClick={saveEdit} disabled={updateMutation.isPending}>
                    <Save className="h-4 w-4 mr-1" />
                    Guardar cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

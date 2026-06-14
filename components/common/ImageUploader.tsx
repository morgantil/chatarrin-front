'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';

interface PreviewFile {
  id: string;
  file: File;
  previewUrl: string;
  cloudinaryUrl?: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}

interface Props {
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  initialUrls?: string[];
}

export function ImageUploader({ onChange, maxFiles = 5, initialUrls }: Props) {
  const [previews, setPreviews] = useState<PreviewFile[]>(() =>
    (initialUrls ?? []).map((url) => ({
      id: Math.random().toString(36).slice(2),
      file: null as unknown as File,
      previewUrl: url,
      cloudinaryUrl: url,
      status: 'done' as const,
    }))
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const notifyUrls = useCallback((updated: PreviewFile[]) => {
    const urls = updated.filter((p) => p.cloudinaryUrl).map((p) => p.cloudinaryUrl!);
    onChange(urls);
  }, [onChange]);

  const uploadFile = async (preview: PreviewFile) => {
    setPreviews((prev) => prev.map((p) => p.id === preview.id ? { ...p, status: 'uploading' } : p));
    try {
      const formData = new FormData();
      formData.append('image', preview.file);
      const token = localStorage.getItem('chatarrin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads/image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const url = data.data?.url || data.url;
      setPreviews((prev) =>
        prev.map((p) => p.id === preview.id ? { ...p, status: 'done' as const, cloudinaryUrl: url } : p)
      );
      // Notificar fuera del setState para evitar el error de React
      setTimeout(() => {
        setPreviews((prev) => {
          notifyUrls(prev);
          return prev;
        });
      }, 0);
    } catch {
      setPreviews((prev) => prev.map((p) => p.id === preview.id ? { ...p, status: 'error' } : p));
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, maxFiles - previews.length);
    const newPreviews: PreviewFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
    }));
    setPreviews((prev) => {
      const updated = [...prev, ...newPreviews];
      // Subir automáticamente
      setTimeout(() => {
        newPreviews.forEach((p) => uploadFile(p));
      }, 0);
      return updated;
    });
  };

  const removeFile = (id: string) => {
    setPreviews((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file && file.file) URL.revokeObjectURL(file.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
    // Notificar después del setState
    setTimeout(() => {
      setPreviews((prev) => {
        notifyUrls(prev);
        return prev;
      });
    }, 0);
  };

  return (
    <div className="flex flex-col gap-3">
      {previews.length < maxFiles && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-brand hover:bg-brand/5 transition-colors">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Arrastrá tus fotos acá o{' '}
            <span className="text-brand font-medium">hacé clic para seleccionar</span>
          </p>
          <p className="text-xs text-muted-foreground">JPG, PNG o WebP · Máx 5MB · Hasta {maxFiles} fotos</p>
          <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {previews.map((preview, index) => (
            <div key={preview.id} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
              <Image src={preview.previewUrl} alt={`Foto ${index + 1}`} fill className="object-cover" />
              {preview.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
              {preview.status === 'error' && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                  <p className="text-white text-xs font-medium">Error</p>
                </div>
              )}
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5">
                  <p className="text-white text-xs text-center">Principal</p>
                </div>
              )}
              <button type="button" onClick={() => removeFile(preview.id)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
          {previews.length < maxFiles && (
            <button type="button" onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-brand transition-colors">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

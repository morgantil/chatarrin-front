'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VisibilityBadge } from '@/components/publications/VisibilityBadge';
import {
  LayoutDashboard, Users, Package, ShieldCheck,
  Tag, Settings, FileText, Download, Check,
  CheckCircle, XCircle, PlusCircle
} from 'lucide-react';

type Tab = 'dashboard' | 'usuarios' | 'publicaciones' | 'verificaciones' | 'categorias' | 'settings' | 'reportes';

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get<any>('/api/admin/dashboard'),
    refetchInterval: 60000,
  });
  if (isLoading) return <LoadingSpinner />;
  const metrics = [
    { label: 'Usuarios totales', value: data?.users.total, sub: `+${data?.users.newLast7Days} esta semana` },
    { label: 'Publicaciones activas', value: data?.publications.active, sub: `${data?.publications.sold} vendidas` },
    { label: 'Ingresos aprobados (ARS)', value: new Intl.NumberFormat('es-AR').format(data?.payments.totalRevenueArs ?? 0), sub: `${data?.payments.approved} pagos` },
    { label: 'Verificaciones pendientes', value: data?.pendingVerifications, sub: 'requieren revisión' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="p-4 rounded-lg border bg-card flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">{m.label}</p>
          <p className="text-2xl font-bold">{m.value ?? '-'}</p>
          <p className="text-xs text-muted-foreground">{m.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── Usuarios ────────────────────────────────────────────────────────────────
function Usuarios() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => api.get<any>(`/api/admin/users?search=${search}`),
  });
  const toggle = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      api.patch(`/api/admin/users/${id}/status`, { isActive: !active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });
  return (
    <div className="flex flex-col gap-4">
      <Input placeholder="Buscar por nombre o WhatsApp..."
        value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      {isLoading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Nombre</th>
                <th className="py-2 pr-4 font-medium">WhatsApp</th>
                <th className="py-2 pr-4 font-medium">Provincia</th>
                <th className="py-2 pr-4 font-medium">Estado</th>
                <th className="py-2 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((u: any) => (
                <tr key={u.id} className="border-b hover:bg-muted/40">
                  <td className="py-2 pr-4 font-medium">{u.name}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{u.whatsapp}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{u.province}</td>
                  <td className="py-2 pr-4">
                    <span className={`text-xs font-medium ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                      {u.isActive ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                  <td className="py-2">
                    {u.role !== 'ADMIN' && (
                      <Button size="sm" variant="outline"
                        onClick={() => toggle.mutate({ id: u.id, active: u.isActive })}>
                        {u.isActive ? 'Suspender' : 'Reactivar'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Publicaciones ────────────────────────────────────────────────────────────
function Publicaciones() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-publications'],
    queryFn: () => api.get<any>('/api/admin/publications'),
  });
  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/admin/publications/${id}/${status === 'ACTIVE' ? 'activate' : 'pause'}`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-publications'] }),
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="flex flex-col gap-3">
      {data?.publications?.map((pub: any) => (
        <div key={pub.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-card">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium truncate">{pub.title}</span>
              <VisibilityBadge visibility={pub.visibility} />
            </div>
            <p className="text-xs text-muted-foreground">
              {pub.seller?.name} · {pub.category?.name} · {pub.weightKg} kg
            </p>
          </div>
          <Button size="sm" variant="outline"
            onClick={() => moderate.mutate({ id: pub.id, status: pub.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' })}>
            {pub.status === 'ACTIVE' ? 'Pausar' : 'Activar'}
          </Button>
        </div>
      ))}
    </div>
  );
}

// ── Verificaciones ───────────────────────────────────────────────────────────
function Verificaciones() {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { data, isLoading } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: () => api.get<any[]>('/api/admin/verifications'),
  });
  const approve = useMutation({
    mutationFn: (sellerId: string) => api.post(`/api/admin/verifications/${sellerId}/approve`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-verifications'] }),
  });
  const reject = useMutation({
    mutationFn: ({ sellerId, note }: { sellerId: string; note: string }) =>
      api.post(`/api/admin/verifications/${sellerId}/reject`, { adminNote: note }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-verifications'] }),
  });
  if (isLoading) return <LoadingSpinner />;
  if (!data?.length) return <EmptyState message="No hay solicitudes pendientes" />;
  return (
    <div className="flex flex-col gap-3">
      {data.map((v: any) => (
        <div key={v.sellerId} className="p-4 rounded-lg border bg-card flex flex-col gap-3">
          <div>
            <p className="font-medium">{v.seller.name}</p>
            <p className="text-xs text-muted-foreground">{v.seller.whatsapp} · {v.seller.province}</p>
            {v.note && <p className="text-sm mt-1 italic text-muted-foreground">"{v.note}"</p>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1"
              onClick={() => approve.mutate(v.sellerId)}>
              <CheckCircle className="h-3 w-3" /> Aprobar
            </Button>
            <Input placeholder="Motivo del rechazo..."
              className="h-8 text-sm max-w-xs"
              value={notes[v.sellerId] || ''}
              onChange={(e) => setNotes((p) => ({ ...p, [v.sellerId]: e.target.value }))} />
            <Button size="sm" variant="outline"
              className="gap-1 border-red-300 text-red-500"
              onClick={() => reject.mutate({ sellerId: v.sellerId, note: notes[v.sellerId] || '' })}>
              <XCircle className="h-3 w-3" /> Rechazar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Categorías ───────────────────────────────────────────────────────────────
function Categorias() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<any[]>('/api/categories'),
  });
  const create = useMutation({
    mutationFn: () => api.post('/api/admin/categories', { name: newName }),
    onSuccess: () => { setNewName(''); queryClient.invalidateQueries({ queryKey: ['categories'] }); },
  });
  const toggle = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/api/admin/categories/${id}`, { isActive: !isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input placeholder="Nueva categoría (ej: Magnesio)"
          value={newName} onChange={(e) => setNewName(e.target.value)} className="max-w-xs" />
        <Button size="sm" className="bg-brand hover:bg-brand-dark text-white gap-1"
          disabled={!newName.trim()} onClick={() => create.mutate()}>
          <PlusCircle className="h-4 w-4" /> Agregar
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {categories?.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <div>
              <span className="text-sm font-medium">{cat.name}</span>
              <span className="text-xs text-muted-foreground ml-2">/{cat.slug}</span>
            </div>
            <Button size="sm" variant="outline"
              onClick={() => toggle.mutate({ id: cat.id, isActive: cat.isActive })}>
              {cat.isActive ? 'Desactivar' : 'Activar'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings ─────────────────────────────────────────────────────────────────
function SettingsPanel() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get<any[]>('/api/admin/settings'),
  });
  const update = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      api.patch(`/api/admin/settings/${key}`, { value }),
    onSuccess: (_, vars) => {
      setSaved((p) => ({ ...p, [vars.key]: true }));
      setTimeout(() => setSaved((p) => ({ ...p, [vars.key]: false })), 2000);
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="flex flex-col gap-3 max-w-lg">
      <p className="text-sm text-muted-foreground">
        Los cambios se aplican en tiempo real. No requiere reiniciar el servidor.
      </p>
      {settings?.map((s) => (
        <div key={s.key} className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">{s.label}</label>
          <div className="flex gap-2">
            <Input value={editing[s.key] ?? s.value}
              onChange={(e) => setEditing((p) => ({ ...p, [s.key]: e.target.value }))}
              className="font-mono" />
            <Button size="sm" variant="outline"
              onClick={() => update.mutate({ key: s.key, value: editing[s.key] ?? s.value })}>
              {saved[s.key] ? <Check className="h-4 w-4 text-green-500" /> : 'Guardar'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{s.key}</p>
        </div>
      ))}
    </div>
  );
}

// ── Reportes ─────────────────────────────────────────────────────────────────
function Reportes() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments-report', from, to],
    queryFn: () => {
      const params = new URLSearchParams();
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      return api.get<any[]>(`/api/admin/reports/payments?${params}`);
    },
  });
  const exportCSV = () => {
    if (!data) return;
    const headers = ['Fecha', 'Usuario', 'WhatsApp', 'Visibilidad', 'Monto ARS'];
    const rows = data.map((p: any) => [
      new Date(p.createdAt).toLocaleDateString('es-AR'),
      p.user.name, p.user.whatsapp, p.visibility, p.amountArs,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `chatarrin-pagos-${Date.now()}.csv`;
    a.click();
  };
  const total = data?.reduce((s: number, p: any) => s + p.amountArs, 0) ?? 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Desde</label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Hasta</label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
        </div>
        {data && data.length > 0 && (
          <Button size="sm" variant="outline" className="gap-1" onClick={exportCSV}>
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
        )}
      </div>
      {isLoading ? <LoadingSpinner /> : !data?.length ? (
        <EmptyState message="No hay pagos en ese período" />
      ) : (
        <>
          <div className="p-3 rounded-lg bg-muted text-sm font-medium">
            Total:{' '}
            <span className="text-brand">
              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(total)}
            </span>
            {' '}· {data.length} pagos
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Fecha</th>
                  <th className="py-2 pr-4 font-medium">Usuario</th>
                  <th className="py-2 pr-4 font-medium">Visibilidad</th>
                  <th className="py-2 font-medium">Monto</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p: any) => (
                  <tr key={p.id} className="border-b hover:bg-muted/40">
                    <td className="py-2 pr-4 text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-2 pr-4">{p.user.name}</td>
                    <td className="py-2 pr-4">
                      <Badge variant="secondary">{p.visibility}</Badge>
                    </td>
                    <td className="py-2 font-medium text-brand">
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p.amountArs)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ── Layout principal del admin ────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'usuarios',       label: 'Usuarios',         icon: Users },
  { id: 'publicaciones',  label: 'Publicaciones',    icon: Package },
  { id: 'verificaciones', label: 'Verificaciones',   icon: ShieldCheck },
  { id: 'categorias',     label: 'Categorías',       icon: Tag },
  { id: 'settings',       label: 'Precios y config', icon: Settings },
  { id: 'reportes',       label: 'Reportes',         icon: FileText },
];

const TAB_TITLES: Record<Tab, string> = {
  dashboard: 'Dashboard',
  usuarios: 'Usuarios',
  publicaciones: 'Publicaciones',
  verificaciones: 'Verificaciones pendientes',
  categorias: 'Categorías de material',
  settings: 'Precios y configuración',
  reportes: 'Reporte de pagos',
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-52 flex-shrink-0">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Administración
          </p>
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap w-full text-left ${
                  tab === t.id
                    ? 'bg-brand text-white'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}>
                <t.icon className="h-4 w-4 flex-shrink-0" />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold mb-6">{TAB_TITLES[tab]}</h1>
          {tab === 'dashboard'      && <Dashboard />}
          {tab === 'usuarios'       && <Usuarios />}
          {tab === 'publicaciones'  && <Publicaciones />}
          {tab === 'verificaciones' && <Verificaciones />}
          {tab === 'categorias'     && <Categorias />}
          {tab === 'settings'       && <SettingsPanel />}
          {tab === 'reportes'       && <Reportes />}
        </div>
      </div>
    </ProtectedRoute>
  );
}

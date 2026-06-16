# Don Chatarrin — Frontend: Estado del Proyecto

**Fecha:** Junio 2026  
**Versión:** 1.0.0  
**Stack:** Next.js 14 (App Router) + TypeScript + TanStack Query + Tailwind CSS v4 + Zustand  
**Deploy:** Vercel (rama `develop`, auto-deploy on push)  
**URL producción:** `https://chatarrin-front.vercel.app`

---

## Estructura de carpetas

```
chatarrin-front/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout raíz: Navbar, Footer, Providers, ThemeProvider
│   ├── globals.css               # Tokens de diseño, dark mode, Tailwind v4
│   ├── page.tsx                  # Homepage: hero, stats, publicaciones destacadas, CTA
│   ├── not-found.tsx             # Página 404
│   ├── (auth)/
│   │   ├── login/page.tsx        # Login con whatsapp + password
│   │   └── registro/page.tsx     # Registro con LocalitySelector en cascada
│   ├── admin/
│   │   └── page.tsx              # Panel admin completo (tabs): dashboard, usuarios,
│   │                             #   publicaciones, verificaciones, categorías,
│   │                             #   localidades, settings, reportes
│   ├── panel/                    # Panel del usuario autenticado
│   │   ├── page.tsx              # Dashboard del vendedor
│   │   ├── publicar/page.tsx     # Crear publicación (con LocalitySelector)
│   │   ├── publicaciones/page.tsx# Mis publicaciones (editar, pausar, eliminar, boost)
│   │   ├── calificaciones/page.tsx # Mis calificaciones recibidas
│   │   └── logistica/page.tsx    # Perfil de transportista (crear/editar/eliminar)
│   ├── publicaciones/
│   │   ├── page.tsx              # Listado público con filtros
│   │   └── [id]/page.tsx         # Detalle de publicación
│   ├── vendedores/
│   │   └── [id]/page.tsx         # Perfil público del vendedor
│   ├── terminos/page.tsx         # Términos y condiciones
│   └── privacidad/page.tsx       # Política de privacidad
├── components/
│   ├── Providers.tsx             # TanStack Query + Sonner toaster
│   ├── common/
│   │   ├── EmptyState.tsx        # Estado vacío genérico
│   │   ├── ImageUploader.tsx     # Subida de imágenes a Cloudinary vía backend
│   │   ├── LoadingSpinner.tsx    # Spinner de carga
│   │   ├── LocalitySelector.tsx  # Selector en cascada: Zona → Localidad (con búsqueda)
│   │   └── ProtectedRoute.tsx    # HOC: redirige si no autenticado o sin rol
│   ├── layout/
│   │   ├── Navbar.tsx            # Navbar sticky con menú mobile (Sheet portal)
│   │   └── Footer.tsx            # Footer con links y marca
│   ├── logistics/
│   │   └── LogisticsCarousel.tsx # Carrusel de transportistas por provincia/peso
│   ├── publications/
│   │   ├── BoostPublicationModal.tsx # Modal para pagar visibilidad (MercadoPago)
│   │   ├── FeaturedPublications.tsx  # Publicaciones destacadas en homepage
│   │   ├── PublicationCard.tsx       # Card de publicación en listado
│   │   ├── PublicationFilters.tsx    # Filtros: material, provincia, zona, localidad, orden
│   │   └── VisibilityBadge.tsx       # Badge FREE/NORMAL/FEATURED/URGENT
│   ├── reviews/
│   │   └── ReviewForm.tsx        # Formulario de calificación al vendedor
│   └── ui/                       # Componentes base custom (NO shadcn/radix)
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dropdown-menu.tsx     # Custom dropdown (no Radix portal)
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx            # Native select wrapper
│       ├── separator.tsx
│       ├── sheet.tsx             # Drawer mobile con createPortal
│       ├── sonner.tsx            # Toast notifications
│       └── textarea.tsx
├── hooks/
│   ├── useAuth.ts                # Lee el store de Zustand, expone isLoggedIn/user
│   ├── useLocalities.ts          # useZones(), useLocalities(), useLocalitySearch()
│   ├── useLogistics.ts           # useLogisticsProfiles()
│   ├── usePayments.ts            # useCreatePaymentPreference()
│   └── usePublications.ts        # usePublications(), usePublication(), useFeatured()
├── lib/
│   ├── api.ts                    # Cliente HTTP: get/post/put/patch/delete con JWT
│   └── utils.ts                  # cn() para classnames
├── store/
│   └── auth.store.ts             # Zustand: user, token, setAuth, clearAuth (localStorage)
└── types/
    └── index.ts                  # Interfaces TypeScript: Publication, User, Locality, etc.
```

---

## Páginas y funcionalidad

### Homepage `/`
- Hero con headline, descripción y CTAs ("Ver publicaciones" / "Publicar material gratis")
- Estadísticas estáticas (+500 pub, +200 vendedores, 23 provincias)
- `FeaturedPublications`: últimas publicaciones FEATURED/URGENT desde la API
- Sección "Así de simple" con los 3 pasos
- CTA final de registro

### Login `/login`
- Campo whatsapp + password
- Llama a `POST /api/auth/login`
- Guarda `{ token, user }` en Zustand + localStorage

### Registro `/registro`
- Campos: nombre, email, whatsapp, password, confirmPassword, provincia
- `LocalitySelector` en cascada (aparece solo si hay provincia seleccionada)
- Selector de provincia con `<select>` nativo (sin Radix para evitar z-index issues)
- Llama a `POST /api/auth/register` con `localityId`

### Publicaciones `/publicaciones`
- `PublicationFilters`: Material (categoría), Provincia, Zona (si hay zonas), Localidad, ordenamiento
- Listado paginado con `PublicationCard`
- Al seleccionar provincia con zonas (ej: Buenos Aires) aparece selector de zona, luego selector de localidad
- Sin filtros de kg/precio (ocultados por decisión de producto)

### Detalle publicación `/publicaciones/[id]`
- Galería de fotos con thumbnails
- Info: título, descripción, precio, peso, ubicación, visitas, fecha
- Card del vendedor con link a su perfil + botón WhatsApp
- Botón "Compartir" (WhatsApp)
- `LogisticsCarousel`: transportistas disponibles en la provincia
- `ReviewForm`: calificar al vendedor (solo si logueado)
- Manejo de resultado de pago por query param (`?pago=ok|error|pendiente`)

### Perfil de vendedor `/vendedores/[id]`
- Info del vendedor: nombre, provincia, verificación, promedio de estrellas
- Grid de publicaciones activas
- Últimas 5 calificaciones recibidas

### Panel del vendedor `/panel`
- Dashboard con resumen (publicaciones activas, ventas, etc.)

### Crear publicación `/panel/publicar`
- Formulario: título, descripción, categoría, peso, precio, negociable, provincia, LocalitySelector, visibilidad, fotos
- `ImageUploader` para subir hasta 5 fotos
- Invalida caché de publicaciones al crear

### Mis publicaciones `/panel/publicaciones`
- Tabla con todas las publicaciones propias
- Edición inline: título, descripción, peso, precio, negociable, categoría, fotos
- Acciones: pausar, reactivar, marcar como vendida, eliminar
- `BoostPublicationModal`: pagar para subir visibilidad

### Logística `/panel/logistica`
- Formulario para crear/editar/eliminar perfil de transportista
- Selección de provincias de cobertura (checkboxes)
- Visibilidad del perfil (FREE/NORMAL/FEATURED)

### Admin `/admin` (solo ADMIN)
Tabs:
- **Dashboard**: métricas globales
- **Usuarios**: búsqueda, activar/suspender
- **Publicaciones**: moderar (activar/pausar)
- **Verificaciones**: aprobar/rechazar solicitudes de vendedores
- **Categorías**: crear, activar/desactivar
- **Localidades**: gestión completa de localidades y zonas por provincia
- **Precios y config**: editar settings globales (precios de visibilidad, etc.)
- **Reportes**: reporte de pagos con filtro de fechas y exportación CSV

---

## LocalitySelector — Sistema en cascada

Componente clave en registro y creación de publicaciones:

1. Si la provincia tiene zonas → muestra `<select>` de zonas
2. Si la zona seleccionada es "CABA" → selección directa (sin localidad)
3. Si la zona tiene localidades → muestra input de búsqueda con resultados
4. Si la provincia NO tiene zonas → muestra directamente búsqueda de localidades

Hooks usados:
- `useZones(province)` → `GET /api/localities/zones?province=`
- `useLocalitySearch(province, zone, query)` → `GET /api/localities/search?province=&zone=&q=`

---

## Estado global — Zustand

`auth.store.ts` persiste en `localStorage`:
```ts
{
  user: { id, name, role, province } | null,
  token: string | null,
  setAuth(user, token): void,
  clearAuth(): void
}
```

El token se incluye automáticamente en todas las requests vía `lib/api.ts`.

---

## Cliente HTTP — `lib/api.ts`

Wrapper sobre `fetch` que:
- Lee el token desde localStorage
- Agrega `Authorization: Bearer <token>`
- Lanza error con el mensaje del backend en caso de respuesta no-ok
- Métodos: `get<T>`, `post<T>`, `put<T>`, `patch<T>`, `delete<T>`
- Base URL: `process.env.NEXT_PUBLIC_API_URL`

---

## Seguridad

### Autenticación client-side
- Token JWT almacenado en `localStorage` (no en cookies httpOnly — pendiente mejora)
- `ProtectedRoute`: redirige a `/login` si no hay token, a `/` si el rol no es el requerido
- `useAuth()` expone `isLoggedIn` y `user` desde el store

### Protección de rutas
- `/panel/*` requiere estar logueado
- `/admin` requiere rol `ADMIN`
- La verificación es client-side — la protección real está en el backend

### XSS
- Next.js escapa por defecto el contenido renderizado
- No se usa `dangerouslySetInnerHTML` en ningún lado

### Imágenes
- `next/image` con `fill` y `sizes` para optimización automática
- Dominios de Cloudinary configurados en `next.config`

### Vulnerabilidades conocidas / pendientes
- Token en `localStorage` es vulnerable a XSS (mejor práctica: cookie httpOnly)
- No hay expiración client-side del token (si el JWT expira el backend rechaza, pero la UI no avisa proactivamente)
- No hay manejo de token expirado que redirija automáticamente al login

---

## Diseño y tema

### Sistema de colores (`globals.css`)
```css
/* Light mode */
--color-background: #FAFAFA
--color-foreground: #111111
--color-card: #FFFFFF
--color-secondary: #F4F4F4
--color-muted-foreground: #6B7280
--color-border: #E5E5E5
--color-brand: #E8480C        /* naranja Don Chatarrin */
--color-brand-dark: #C73D0A
--color-accent: #F5A623

/* Dark mode (.dark) */
--color-background: #0F0F0F
--color-foreground: #F5F5F5
--color-card: #1A1A1A
--color-secondary: #222222
--color-border: #2A2A2A
```

- `@theme` (Tailwind v4) — sin `inline` para que dark mode funcione con CSS vars dinámicas
- Toggle dark/light en Navbar (next-themes)
- `@custom-variant dark (&:is(.dark *))` para variante dark de Tailwind

### Componentes UI
- **No se usa shadcn/ui ni Radix UI** (se reemplazaron por componentes custom para evitar problemas de z-index con portales)
- `Sheet` usa `createPortal` a `document.body` para el menú mobile
- Todos los selects son `<select>` nativos
- Formularios con `react-hook-form` + `zod`

---

## Variables de entorno requeridas

```env
NEXT_PUBLIC_API_URL=https://chatarrin-backend-production.up.railway.app
```

---

## Ramas Git

| Rama | Propósito |
|------|-----------|
| `develop` | Rama principal, conectada a Vercel (auto-deploy) |
| `test` | Rama de trabajo — se mergea a develop |
| `develop-mejoras-2` | Rama activa actual para nuevas features |

---

## Estado actual — Qué funciona en producción

- ✅ Homepage con publicaciones destacadas
- ✅ Listado de publicaciones con filtros (provincia, zona, localidad, categoría, orden)
- ✅ Selector en cascada Provincia → Zona → Localidad (Buenos Aires completo)
- ✅ Detalle de publicación con fotos, info, contacto WhatsApp
- ✅ Registro y login
- ✅ Crear, editar, pausar, eliminar publicaciones propias
- ✅ Subida de imágenes a Cloudinary
- ✅ Perfil de transportista
- ✅ Carrusel de transportistas en detalle
- ✅ Calificaciones entre usuarios
- ✅ Panel admin completo con gestión de localidades y zonas
- ✅ Pagos MercadoPago para visibilidad
- ✅ Dark mode
- ✅ Mobile responsive

## Estado actual — Qué falta / está pendiente

- ⬜ Token en cookie httpOnly (mejora de seguridad)
- ⬜ Manejo proactivo de token expirado (redirect automático al login)
- ⬜ Búsqueda por texto libre en publicaciones
- ⬜ Paginación visible en el listado (hay paginación en backend, falta UI)
- ⬜ Exportación CSV de publicaciones desde admin
- ⬜ Estadísticas del vendedor (visitas totales, ratio por estado)
- ⬜ Notificaciones (ningún sistema actualmente)
- ⬜ Tests (ninguno actualmente)
- ⬜ Zonas para otras provincias (solo Buenos Aires configurado)

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <Link href="/" className="flex items-center gap-0">
              <span className="text-sm font-black tracking-tight text-foreground">don chatar</span>
              <span className="text-sm font-black tracking-tight text-brand">rin</span>
            </Link>
            <p className="text-xs text-muted-foreground">Marketplace de metales reciclables · Argentina</p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/publicaciones" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Publicaciones
            </Link>
            <Link href="/registro" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Publicar gratis
            </Link>
            <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Don Chatarrin. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terminos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </Link>
            <Link href="/privacidad" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

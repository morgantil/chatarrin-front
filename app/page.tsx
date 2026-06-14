import Link from 'next/link';
import { ArrowRight, Recycle, Truck, ShieldCheck, Package } from 'lucide-react';
import { FeaturedPublications } from '@/components/publications/FeaturedPublications';

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6 py-16 md:py-24 px-4">
        <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Marketplace activo en toda Argentina
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] max-w-3xl text-foreground">
          Comprá y vendé chatarra{' '}
          <span className="text-brand">sin vueltas.</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
          Conectamos vendedores de metales usados con acopiadores, fundiciones y compradores en todo el país.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/publicaciones"
            className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
          >
            Ver publicaciones
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/registro"
            className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-muted text-foreground font-semibold px-6 py-3 rounded-full text-sm border border-border transition-colors"
          >
            Publicar material gratis
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 sm:gap-10 mt-4 pt-6 border-t border-border w-full max-w-sm">
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl font-black text-foreground">+500</span>
            <span className="text-xs text-muted-foreground mt-0.5">publicaciones</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl font-black text-foreground">+200</span>
            <span className="text-xs text-muted-foreground mt-0.5">vendedores</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl font-black text-foreground">23</span>
            <span className="text-xs text-muted-foreground mt-0.5">provincias</span>
          </div>
        </div>
      </section>

      {/* Publicaciones destacadas */}
      <FeaturedPublications />

      {/* Cómo funciona */}
      <section className="py-12 md:py-16 border-t border-border">
        <div className="px-4 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">Así de simple</h2>
            <p className="text-sm text-muted-foreground mt-2">Tres pasos para vender tu material</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Package,
                title: 'Publicá tu material',
                desc: 'Cargá el tipo de metal, peso, fotos y precio. Sin costo para empezar.',
              },
              {
                step: '02',
                icon: ShieldCheck,
                title: 'Conectá con compradores',
                desc: 'Acopiadores y fundiciones verificados te contactan directo por WhatsApp.',
              },
              {
                step: '03',
                icon: Truck,
                title: 'Coordiná el retiro',
                desc: 'Encontrá transportistas disponibles en tu zona desde cada publicación.',
              },
            ].map((f) => (
              <div key={f.step} className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border hover:border-brand/30 transition-colors group">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center group-hover:bg-brand/15 transition-colors">
                    <f.icon className="h-5 w-5 text-brand" />
                  </div>
                  <span className="text-3xl font-black text-border select-none">{f.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 md:py-16 border-t border-border">
        <div className="px-4 max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center">
            <Recycle className="h-6 w-6 text-brand" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground">
            ¿Tenés material para vender?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Publicar es gratis. Llegás a compradores de todo el país en minutos.
          </p>
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 rounded-full text-sm transition-colors mt-2"
          >
            Crear publicación gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}

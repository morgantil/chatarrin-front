import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Recycle, Truck, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-8">

      {/* Hero */}
      <section className="text-center flex flex-col items-center gap-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          El mercado de chatarra<br />
          <span className="text-brand">que faltaba.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Publicá tus publicaciones de metales reciclables y conectá con compradores en todo Argentina.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button size="lg" className="bg-brand hover:bg-brand-dark text-white" asChild>
            <Link href="/publicaciones">
              Ver publicaciones <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/registro">Crear publicación</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Recycle, title: 'Publicá tu material', desc: 'Cargá el material, el peso, las fotos y tu precio. Gratis para empezar.' },
          { icon: ShieldCheck, title: 'Compradores reales', desc: 'Conectá con acopiadores, fundiciones y compradores verificados de todo el país.' },
          { icon: Truck, title: 'Logística incluida', desc: 'Encontrá transportistas disponibles en tu zona directo desde cada publicación.' },
        ].map((f) => (
          <div key={f.title} className="flex flex-col gap-3 p-6 rounded-lg border bg-card">
            <f.icon className="h-8 w-8 text-brand" />
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}

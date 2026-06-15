import Link from 'next/link';

export const metadata = { title: 'Términos y Condiciones | Don Chatarrin' };

export default function TerminosPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link href="/" className="text-xs text-brand hover:underline mb-8 inline-block">← Volver al inicio</Link>

      <h1 className="text-3xl font-black text-foreground mb-2">Términos y Condiciones</h1>
      <p className="text-xs text-muted-foreground mb-8">Última actualización: junio 2025</p>

      <div className="flex flex-col gap-6 text-sm text-foreground leading-relaxed">

        <section>
          <h2 className="font-bold text-base mb-2">1. Aceptación</h2>
          <p className="text-muted-foreground">
            Al acceder y usar Don Chatarrin, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo, no uses la plataforma.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">2. Descripción del servicio</h2>
          <p className="text-muted-foreground">
            Don Chatarrin es una plataforma de marketplace que conecta vendedores de materiales reciclables con compradores en Argentina. No somos parte de las transacciones entre usuarios y no garantizamos la calidad ni existencia del material publicado.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">3. Registro y cuenta</h2>
          <p className="text-muted-foreground">
            Para publicar material debés registrarte con datos verídicos. Sos responsable de mantener la confidencialidad de tu contraseña y de toda actividad realizada bajo tu cuenta.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">4. Publicaciones</h2>
          <p className="text-muted-foreground">
            Las publicaciones deben corresponder a materiales reciclables reales. Queda prohibido publicar material inexistente, duplicado, o en categorías incorrectas. Nos reservamos el derecho de eliminar publicaciones que no cumplan estas condiciones.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">5. Pagos y visibilidad</h2>
          <p className="text-muted-foreground">
            Los pagos de planes de visibilidad se procesan a través de MercadoPago. Una vez acreditado el pago, la visibilidad es activada automáticamente. No se realizan devoluciones salvo fallo técnico imputable a Don Chatarrin.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">6. Conducta del usuario</h2>
          <p className="text-muted-foreground">
            Está prohibido usar la plataforma para actividades ilegales, spam, o cualquier acción que perjudique a otros usuarios o a la plataforma. El incumplimiento puede resultar en la suspensión de la cuenta.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">7. Limitación de responsabilidad</h2>
          <p className="text-muted-foreground">
            Don Chatarrin no se hace responsable por daños directos o indirectos derivados del uso de la plataforma, incluyendo disputas entre usuarios, pérdidas económicas, o interrupciones del servicio.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">8. Modificaciones</h2>
          <p className="text-muted-foreground">
            Podemos modificar estos términos en cualquier momento. Te notificaremos por email ante cambios relevantes. El uso continuado de la plataforma implica aceptación de los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">9. Contacto</h2>
          <p className="text-muted-foreground">
            Consultas sobre estos términos: <a href="mailto:hola@chatarrin.com.ar" className="text-brand hover:underline">hola@chatarrin.com.ar</a>
          </p>
        </section>

      </div>
    </div>
  );
}

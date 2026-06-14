import Link from 'next/link';

export const metadata = { title: 'Política de Privacidad | Chatarrin' };

export default function PrivacidadPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Link href="/" className="text-xs text-brand hover:underline mb-8 inline-block">← Volver al inicio</Link>

      <h1 className="text-3xl font-black text-foreground mb-2">Política de Privacidad</h1>
      <p className="text-xs text-muted-foreground mb-8">Última actualización: junio 2025</p>

      <div className="flex flex-col gap-6 text-sm text-foreground leading-relaxed">

        <section>
          <h2 className="font-bold text-base mb-2">1. Datos que recopilamos</h2>
          <p className="text-muted-foreground">
            Al registrarte recopilamos: nombre, email, número de WhatsApp y provincia. Al publicar, recopilamos los datos de la publicación (tipo de material, peso, precio, fotos, ubicación). Registramos visitas a publicaciones de forma anónima.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">2. Uso de los datos</h2>
          <p className="text-muted-foreground">
            Usamos tus datos para: operar la plataforma, conectarte con compradores o vendedores, procesar pagos, y mejorar el servicio. No vendemos ni cedemos tus datos a terceros con fines comerciales.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">3. Datos visibles para otros usuarios</h2>
          <p className="text-muted-foreground">
            Tu nombre, provincia y número de WhatsApp pueden ser vistos por usuarios registrados que accedan a tus publicaciones. Tu email nunca se muestra públicamente.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">4. Cookies y almacenamiento</h2>
          <p className="text-muted-foreground">
            Usamos localStorage para mantener tu sesión activa. No usamos cookies de rastreo ni publicidad. Podemos usar herramientas de analítica básica (como conteo de visitas) de forma anónima.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">5. Pagos</h2>
          <p className="text-muted-foreground">
            Los pagos son procesados por MercadoPago. No almacenamos datos de tarjetas ni información financiera. Consultá la política de privacidad de MercadoPago para más detalles.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">6. Retención de datos</h2>
          <p className="text-muted-foreground">
            Conservamos tus datos mientras tu cuenta esté activa. Podés solicitar la eliminación de tu cuenta y datos asociados en cualquier momento escribiéndonos a nuestro email de contacto.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">7. Tus derechos</h2>
          <p className="text-muted-foreground">
            Tenés derecho a acceder, rectificar o eliminar tus datos personales según la Ley de Protección de Datos Personales N° 25.326 (Argentina). Ejercé tus derechos contactándonos por email.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2">8. Contacto</h2>
          <p className="text-muted-foreground">
            Consultas sobre privacidad: <a href="mailto:hola@chatarrin.com.ar" className="text-brand hover:underline">hola@chatarrin.com.ar</a>
          </p>
        </section>

      </div>
    </div>
  );
}

import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  
  if (!slug) return {}

  const ogUrl = `/api/og?colors=${slug}`

  return {
    title: "Paleta Generada | CROMATIK",
    description: "Alguien ha compartido una paleta de colores profesional generada con CROMATIK.",
    openGraph: {
      title: "Paleta Generada | CROMATIK",
      description: "Mira esta paleta de colores profesional y accesible generada matemáticamente.",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: "Vista previa de la paleta de colores",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Paleta de Colores | CROMATIK",
      description: "Paleta generada en CROMATIK, Laboratorio Visual de Bolsillo.",
      images: [ogUrl],
    },
  }
}

export default async function SharedPalettePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const targetUrl = resolvedParams.slug ? `/herramienta?p=${resolvedParams.slug}` : "/herramienta"

  return (
    <html>
      <head>
        {/* Client-side redirect that crawlers like WhatsApp/Twitter ignore, allowing them to read the OG tags */}
        <meta httpEquiv="refresh" content={`0; url=${targetUrl}`} />
      </head>
      <body className="bg-[#0a0a0a] flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-white font-mono text-sm animate-pulse">Cargando paleta de colores...</p>
        </div>
        
        {/* Fallback script in case meta refresh fails */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.href = "${targetUrl}";`
          }}
        />
      </body>
    </html>
  )
}

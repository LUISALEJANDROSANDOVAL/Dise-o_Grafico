import { getPalettes, deletePalette } from "@/app/actions"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, ArrowLeft, Trash2 } from "lucide-react"

export default async function MisPaletasPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    redirect("/")
  }

  const palettes = await getPalettes()

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Volver a la herramienta
            </Link>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-blue-500" />
              Mis Paletas Guardadas
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Aquí puedes ver y gestionar las combinaciones de colores que has creado.
            </p>
          </div>
        </div>

        {palettes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-black/20 p-12 text-center h-64">
            <div className="rounded-full bg-slate-100 dark:bg-slate-900 p-4 mb-4">
              <LayoutDashboard className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium">Aún no tienes paletas guardadas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              Ve a la herramienta principal, crea una combinación perfecta y guárdala para que aparezca aquí.
            </p>
            <Link href="/herramienta?profile=entrepreneur" className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700">
              Crear mi primera paleta
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {palettes.map((palette: any) => {
              const swatches = JSON.parse(palette.colores) as string[]
              return (
                <div key={palette.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-black">
                  {/* Swatches preview */}
                  <div className="flex h-32 w-full">
                    {swatches.map((color, i) => (
                      <div key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  
                  {/* Details */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: palette.color_base }} />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Color Base</span>
                      </div>
                      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400 uppercase">
                        {palette.esquema_tipo}
                      </span>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                        {new Date(palette.creado_en).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link 
                          href={`/herramienta?id=${palette.id}&color=${palette.color_base.replace('#', '')}&scheme=${palette.esquema_tipo}`}
                          className="text-blue-500 hover:text-blue-600 px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-md transition-colors text-sm font-medium"
                        >
                          Abrir
                        </Link>
                        <form action={async () => {
                          "use server"
                          await deletePalette(palette.id)
                        }}>
                          <button type="submit" className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors" title="Eliminar paleta">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

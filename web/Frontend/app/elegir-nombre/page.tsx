"use client"

import { useEffect, useState } from "react"
import { RulecHeader, type Profile } from "@/components/rulec-header"
import { motion } from "framer-motion"
import { Sparkles, BrainCircuit, Hourglass, CheckCircle2 } from "lucide-react"

export default function ElegirNombrePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [profile, setProfile] = useState<Profile>("entrepreneur")

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.classList.toggle("light", theme === "light")
  }, [theme])

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-950 dark:bg-[#0a0a0a] dark:text-slate-50 selection:bg-blue-500/30">
      <RulecHeader
        profile={profile}
        onProfileChange={setProfile}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        hideProfileToggle={true}
      />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16 md:py-24">
        {/* Hero Section */}
        <div className="flex flex-col gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" /> Guía Práctica
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-balance text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            El arte de elegir el <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">nombre perfecto</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 mx-auto max-w-2xl leading-relaxed"
          >
            El nombre de tu marca es tu primera carta de presentación. No necesitas ser un experto en branding, solo seguir estos 4 principios fundamentales.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tip 1 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-colors hover:border-blue-500/30 dark:border-white/10 dark:bg-black/40 dark:hover:border-blue-500/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Fácil de pronunciar y recordar</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Evita nombres demasiado largos o con ortografía complicada. Si tienes que deletrearlo varias veces, probablemente sea demasiado complejo. Un buen nombre fluye de manera natural en una conversación.
            </p>
          </motion.section>

          {/* Tip 2 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="group flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-colors hover:border-purple-500/30 dark:border-white/10 dark:bg-black/40 dark:hover:border-purple-500/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Que refleje la esencia</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              El nombre no necesita describir exactamente lo que haces, pero sí debe transmitir la <strong>emoción o valor</strong> correcto. (Ejemplo: "Nike" inspira victoria, no dice literalmente "Zapatos Deportivos").
            </p>
          </motion.section>

          {/* Tip 3 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="group flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-colors hover:border-rose-500/30 dark:border-white/10 dark:bg-black/40 dark:hover:border-rose-500/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <Hourglass className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Evita modas pasajeras</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No uses prefijos o sufijos solo porque están de moda en este momento (como "i-Algo" o "Algo-ify"). Piensa en un nombre atemporal que pueda seguir sonando bien y profesional dentro de 10 años.
            </p>
          </motion.section>

          {/* Tip 4 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="group flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-colors hover:border-amber-500/30 dark:border-white/10 dark:bg-black/40 dark:hover:border-amber-500/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Verifica la disponibilidad</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Antes de encariñarte con un nombre, busca si está disponible el dominio web (.com, .net, etc.) y revisa que no haya otra marca usándolo en las redes sociales que planeas utilizar para evitar conflictos legales.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  )
}

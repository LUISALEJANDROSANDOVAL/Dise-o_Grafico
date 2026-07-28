"use client"

import { useEffect, useState } from "react"
import { RulecHeader, type Profile } from "@/components/rulec-header"
import { motion } from "framer-motion"
import { Sparkles, BrainCircuit, Hourglass, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/hooks/useTheme"
import { useDragScroll } from "@/hooks/useDragScroll"
import { BrandingTypes } from "@/components/branding-types"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ElegirNombrePage() {
  const [theme, setTheme] = useTheme()
  const dragScroll = useDragScroll<HTMLDivElement>()
  const [profile, setProfile] = useState<Profile>("entrepreneur")
  const [showBranding, setShowBranding] = useState(false)

  const handleShowBranding = () => {
    setShowBranding(true)
  }

  const handleHideBranding = () => {
    setShowBranding(false)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-950 dark:bg-[#0a0a0a] dark:text-slate-50 selection:bg-blue-500/30">
      <RulecHeader
        profile={profile}
        onProfileChange={setProfile}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        hideProfileToggle={true}
      />

      {/* Hero Section */}
      {!showBranding && (
        <main id="hero-section" className="mx-auto flex w-full h-full max-w-full flex-col items-center justify-center gap-6 px-6 pb-6 pt-2 md:px-12 lg:px-24 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col gap-4 text-center">
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

        {/* Steps Slider */}
        <div 
          {...dragScroll}
          className={`flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragScroll.className}`}
        >
          {/* Tip 1 */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group flex w-full min-w-[85vw] max-w-[400px] flex-none snap-center flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-colors hover:border-blue-500/30 sm:min-w-[400px] dark:border-white/10 dark:bg-black/40 dark:hover:border-blue-500/30"
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
            className="group flex w-full min-w-[85vw] max-w-[400px] flex-none snap-center flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-colors hover:border-purple-500/30 sm:min-w-[400px] dark:border-white/10 dark:bg-black/40 dark:hover:border-purple-500/30"
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
            className="group flex w-full min-w-[85vw] max-w-[400px] flex-none snap-center flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-colors hover:border-rose-500/30 sm:min-w-[400px] dark:border-white/10 dark:bg-black/40 dark:hover:border-rose-500/30"
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
            className="group flex w-full min-w-[85vw] max-w-[400px] flex-none snap-center flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-colors hover:border-amber-500/30 sm:min-w-[400px] dark:border-white/10 dark:bg-black/40 dark:hover:border-amber-500/30"
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

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col items-center gap-12 pt-2"
        >
          <Link
            href="/elegir-nombre/crear"
            className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 active:scale-95"
          >
            Empezar a crear mi nombre
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Scroll down indicator - Always visible at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-4 mb-4 flex justify-center"
        >
          <button 
            onClick={handleShowBranding}
            className="group flex animate-bounce flex-col items-center gap-1 rounded-full border border-slate-200/60 bg-white/80 px-6 py-2 text-slate-500 shadow-sm backdrop-blur-xl transition-all hover:border-blue-500/30 hover:bg-white hover:text-blue-600 dark:border-white/10 dark:bg-black/60 dark:hover:border-blue-500/30 dark:hover:bg-black dark:hover:text-blue-400"
            aria-label="Ver tipos de diseño de marca"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Tipos de logo</span>
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
          </button>
        </motion.div>
      </main>
    )}

      {/* Branding Types Section */}
      {showBranding && (
        <div className="w-full h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12 pt-4 px-6 md:px-12">
          <BrandingTypes onBack={handleHideBranding} />
        </div>
      )}
    </div>
  )
}

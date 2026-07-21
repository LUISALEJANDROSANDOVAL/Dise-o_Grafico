"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Palette, Store, Wand2, Eye, ShieldCheck, ArrowRight, BookOpen } from "lucide-react"
import { InteractiveParticles } from "@/components/interactive-particles"
import { RulecHeader } from "@/components/rulec-header"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.classList.toggle("light", theme === "light")
  }, [theme])
  return (
    <div className="relative flex min-h-dvh flex-col bg-slate-50 text-slate-950 dark:bg-[#0a0a0a] dark:text-slate-50 overflow-hidden font-sans">
      
      {/* Background Particles / Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <InteractiveParticles />
        <motion.div 
          animate={{ 
            x: [0, 30, -20, 0], 
            y: [0, -40, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 mix-blend-multiply blur-[120px] dark:bg-blue-600/20 dark:mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 20, 0], 
            y: [0, 50, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-purple-400/20 mix-blend-multiply blur-[120px] dark:bg-purple-600/20 dark:mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            x: [0, 20, -10, 0], 
            y: [0, -20, 10, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] h-[600px] w-[600px] rounded-full bg-indigo-400/20 mix-blend-multiply blur-[120px] dark:bg-indigo-600/20 dark:mix-blend-screen"
        />
      </div>

      {/* Header */}
      <RulecHeader 
        theme={theme}
        onThemeToggle={() => setTheme(t => t === "dark" ? "light" : "dark")}
        hideProfileToggle={true}
      />

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 pt-40 pb-20 text-center sm:pt-48 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex max-w-4xl flex-col items-center gap-8"
          >
            {/* Chip */}
            <span className="rounded-full border border-slate-200 bg-white/60 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/40 dark:text-slate-300">
              Tu identidad visual en segundos
            </span>
            
            {/* Title */}
            <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Dale <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">color</span> a tu marca con inteligencia y propósito
            </h1>
            
            {/* Subtitle */}
            <p className="max-w-2xl text-pretty text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400 sm:text-xl">
              CROMATIC te guía paso a paso para crear la paleta de colores perfecta. Basada en psicología del color, accesibilidad y previsualización en tiempo real.
            </p>
          </motion.div>
        </section>

        {/* Choice Cards (CTAs) */}
        <section className="mx-auto max-w-7xl px-6 pb-24 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="grid gap-6 md:grid-cols-3"
          >
            {/* Entrepreneur Card */}
            <div className="group relative flex h-full flex-col rounded-[2rem] border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/10 dark:bg-black/40 dark:hover:border-blue-500/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Store className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-3xl font-bold tracking-tight">Tengo una marca</h3>
              <p className="mb-8 text-slate-600 dark:text-slate-400 leading-relaxed">
                No sé por dónde empezar. Quiero un modo guiado que me explique qué colores usar y por qué, sin lenguaje técnico complicado.
              </p>
              <div className="mt-auto">
                <Link 
                  href="/herramienta?profile=entrepreneur"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 font-semibold text-white transition-all hover:bg-blue-600 active:scale-[0.98]"
                >
                  Empezar modo guiado <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Designer Card */}
            <div className="group relative flex h-full flex-col rounded-[2rem] border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 dark:border-white/10 dark:bg-black/40 dark:hover:border-purple-500/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <Palette className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-3xl font-bold tracking-tight">Soy diseñador</h3>
              <p className="mb-8 text-slate-600 dark:text-slate-400 leading-relaxed">
                Quiero acceso directo al motor de color con control preciso (HSL, CMYK), exportación técnica y validación instantánea de contraste.
              </p>
              <div className="mt-auto">
                <Link 
                  href="/herramienta?profile=designer"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-transparent px-6 font-semibold text-slate-900 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] dark:border-white/10 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/5"
                >
                  Abrir herramientas avanzadas <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Guide Card */}
            <div className="group relative flex h-full flex-col rounded-[2rem] border border-slate-200/60 bg-white/50 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 dark:border-white/10 dark:bg-black/40 dark:hover:border-emerald-500/30">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <BookOpen className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h3 className="mb-3 text-3xl font-bold tracking-tight">Busco un nombre</h3>
              <p className="mb-8 text-slate-600 dark:text-slate-400 leading-relaxed">
                Aún no tengo un nombre para mi marca. Quiero una guía práctica que me ayude a elegir el nombre perfecto paso a paso.
              </p>
              <div className="mt-auto">
                <Link 
                  href="/elegir-nombre"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 px-6 font-semibold text-emerald-900 transition-all hover:border-emerald-300 hover:bg-emerald-100 active:scale-[0.98] dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/40"
                >
                  Leer la guía <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="relative border-t border-slate-200/50 bg-white/30 backdrop-blur-md px-6 py-24 dark:border-white/10 dark:bg-black/20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Todo lo que necesitas para tu identidad</h2>
            </div>
            <div className="grid gap-12 sm:grid-cols-3">
              <FeatureCard 
                icon={<Eye strokeWidth={1.5} className="h-6 w-6" />} 
                title="Mockups en tiempo real" 
                desc="Previsualiza tu paleta instantáneamente en tarjetas de presentación y aplicaciones móviles reales."
                colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              />
              <FeatureCard 
                icon={<ShieldCheck strokeWidth={1.5} className="h-6 w-6" />} 
                title="Validación WCAG" 
                desc="Asegura que tu texto sea siempre legible con alertas automáticas de contraste según estándares globales." 
                colorClass="bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
              />
              <FeatureCard 
                icon={<Wand2 strokeWidth={1.5} className="h-6 w-6" />} 
                title="Generación Inteligente" 
                desc="Calcula esquemas monocromáticos, complementarios o análogos en un solo clic basado en armonía matemática." 
                colorClass="bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, desc, colorClass }: { icon: React.ReactNode, title: string, desc: string, colorClass: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${colorClass}`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}

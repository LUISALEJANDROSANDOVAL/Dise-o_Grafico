"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Component, Type, Columns, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  {
    id: "isotipo",
    name: "Isotipo",
    icon: Component,
    color: "text-rose-500",
    bg: "bg-rose-100 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-900",
    what: "Es la representación puramente icónica o simbólica de una marca. No contiene texto, lo que significa que el símbolo por sí solo es capaz de evocar a la empresa en la mente del consumidor.",
    why: "Requiere un alto nivel de consolidación y recordación en el mercado. Cuando una marca es muy famosa, puede permitirse prescindir del nombre escrito.",
    examples: "La \"M\" dorada de McDonald's o las figuras geométricas de PlayStation."
  },
  {
    id: "logotipo",
    name: "Logotipo",
    icon: Type,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-900",
    what: "En el ámbito estricto del diseño, el logotipo es la representación gráfica que se identifica únicamente por el texto o tipografía.",
    why: "Toda la carga estética y de personalidad recae sobre el diseño de las letras, el tipo de fuente (tipografía), el espaciado y los trazos personalizados.",
    examples: "Las marcas de moda o tecnología como Vogue o Canon, donde el nombre escrito es el único protagonista."
  },
  {
    id: "imagotipo",
    name: "Imagotipo",
    icon: Columns,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-900",
    what: "Es la combinación de imagen y texto, pero con una característica fundamental: ambos elementos están claramente diferenciados (usualmente el icono está al lado o arriba del texto) y pueden funcionar por separado.",
    why: "Ofrece una gran versatilidad. En espacios reducidos (como el ícono de una app) puedes usar solo el símbolo, mientras que en otros contextos puedes usar ambos juntos.",
    examples: "Lacoste (el cocodrilo junto al texto) o Nike (la famosa \"palomita\" o swoosh acompañada o no de la palabra Nike)."
  },
  {
    id: "isologo",
    name: "Isologo",
    icon: Layers,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-900",
    what: "Es la integración total donde el texto y el icono se funden en un solo bloque compacto. Forman una unidad indivisible: no funcionan el uno sin el otro.",
    why: "A diferencia del imagotipo, si intentas separar el texto del dibujo, el diseño pierde sentido o se rompe visualmente. Su estructura suele recordar a sellos, insignias o escudos.",
    examples: "Los emblemas circulares de Lays o Burger King, donde las letras están atrapadas o diseñadas de manera inseparable dentro del mismo gráfico."
  }
]

interface BrandingTypesProps {
  onBack?: () => void
}

export function BrandingTypes({ onBack }: BrandingTypesProps) {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id)

  const activeCategory = CATEGORIES.find(c => c.id === activeTab)!

  return (
    <section id="branding-types" className="mx-auto flex w-full h-full max-w-7xl flex-col items-center justify-center py-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Conoce los 4 tipos de diseño de marca</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Descubre las grandes categorías del diseño gráfico y elige la que mejor se adapte a tu visión.
        </p>
      </div>

      <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white/50 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40 md:flex-row md:min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="flex flex-row overflow-x-auto border-b border-slate-200/60 p-6 md:w-72 md:flex-col md:border-b-0 md:border-r dark:border-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl px-4 py-4 text-left font-semibold transition-colors shrink-0",
                  isActive ? "text-slate-900 dark:text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-2xl bg-slate-100 dark:bg-slate-800"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={cn("relative z-10 flex h-10 w-10 items-center justify-center rounded-xl", isActive ? cat.bg : "bg-transparent")}>
                  <Icon className={cn("h-5 w-5", isActive ? cat.color : "text-slate-400")} />
                </div>
                <span className="relative z-10 text-lg">{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="relative flex-1 p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              <div className="flex items-center gap-4">
                <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", activeCategory.bg)}>
                  <activeCategory.icon className={cn("h-7 w-7", activeCategory.color)} />
                </div>
                <h3 className="text-3xl font-bold">{activeCategory.name}</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className={cn("rounded-2xl border p-5", activeCategory.border, activeCategory.bg)}>
                  <h4 className="mb-2 font-bold text-slate-900 dark:text-slate-100">¿Qué es?</h4>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeCategory.what}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/40 p-5 dark:border-white/5 dark:bg-white/5">
                  <h4 className="mb-2 font-bold text-slate-900 dark:text-slate-100">¿Por qué funciona?</h4>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeCategory.why}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/60 bg-white/40 p-5 dark:border-white/5 dark:bg-white/5">
                <h4 className="mb-2 font-bold text-slate-900 dark:text-slate-100">Ejemplos clásicos</h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {activeCategory.examples}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Back to top button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            if (onBack) {
              onBack()
            } else {
              document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" })
            }
          }}
          className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-6 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-xl transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-y-1"
          >
            <path d="m18 15-6-6-6 6" />
          </motion.svg>
          Volver a inicio
        </button>
      </div>
    </section>
  )
}

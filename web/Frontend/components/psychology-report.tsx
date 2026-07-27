"use client"

import { motion } from "framer-motion"
import { BrainCircuit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type HSL, type Scheme, SCHEMES, hslToHex } from "@/lib/color"
import { getColorPsychology } from "@/components/color-engine"

type Props = {
  base: HSL
  scheme: Scheme
  onClose: () => void
}

export function PsychologyReport({ base, scheme, onClose }: Props) {
  const baseHex = hslToHex(base)
  const primaryPsycho = getColorPsychology(base.h)
  
  let secondaryHue = base.h
  if (scheme === "complementary") secondaryHue = (base.h + 180) % 360
  else if (scheme === "triad") secondaryHue = (base.h + 120) % 360
  else if (scheme === "analogous") secondaryHue = (base.h + 30) % 360
  
  const secondaryPsycho = getColorPsychology(secondaryHue)
  const secondaryHex = hslToHex({ h: secondaryHue, s: base.s, l: base.l })

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl dark:border dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Header / Colors Banner */}
      <div className="flex h-40 w-full shrink-0">
        <div className="h-full flex-1" style={{ backgroundColor: baseHex }} />
        {scheme !== "mono" && primaryPsycho.name !== secondaryPsycho.name && (
          <div className="h-full flex-1" style={{ backgroundColor: secondaryHex }} />
        )}
      </div>
      
      <div className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-indigo-500" />
          <h3 className="text-2xl font-bold tracking-tight">Análisis Psicológico de Marca</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar análisis">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Descubre qué transmite tu paleta de colores y cómo la percibirán tus clientes. Este análisis está basado en la psicología del color y la teoría del diseño.
        </p>

        <div className="grid gap-8">
          {/* Primary Color Analysis */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: baseHex }} />
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Color Principal: {primaryPsycho.name}
              </h4>
            </div>
            <p className="mb-4 text-lg font-medium text-blue-600 dark:text-blue-400">{primaryPsycho.meaning}</p>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{primaryPsycho.fullDesc}</p>
          </div>

          {/* Secondary Color Analysis */}
          {scheme !== "mono" && primaryPsycho.name !== secondaryPsycho.name && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/30">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: secondaryHex }} />
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Color Secundario: {secondaryPsycho.name}
                </h4>
              </div>
              <p className="mb-4 text-lg font-medium text-slate-700 dark:text-slate-300">{secondaryPsycho.meaning}</p>
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">{secondaryPsycho.fullDesc}</p>
            </div>
          )}

          {/* Scheme Harmony Analysis */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 dark:border-indigo-900/30 dark:bg-indigo-950/20">
            <h4 className="mb-3 text-xl font-bold text-indigo-900 dark:text-indigo-100">
              Sinergia: {SCHEMES.find(s => s.id === scheme)?.entrepreneur}
            </h4>
            <p className="text-base leading-relaxed text-indigo-800/80 dark:text-indigo-200/80">
              {SCHEMES.find(s => s.id === scheme)?.explanation}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

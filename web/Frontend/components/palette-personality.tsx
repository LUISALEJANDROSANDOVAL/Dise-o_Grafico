"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import type { Swatch } from "@/lib/color"

type Props = {
  palette: Swatch[]
}

export function PalettePersonality({ palette }: Props) {
  const { warmth, fun, modern } = useMemo(() => {
    if (!palette || palette.length === 0) return { warmth: 50, fun: 50, modern: 50 }

    // 1. Warmth (Cálida vs Fría)
    let warmScore = 0
    let totalWeight = 0
    palette.forEach((s) => {
      // Ignore very dark or very light colors for hue weighting
      const weight = (s.s / 100) * (s.l > 10 && s.l < 90 ? 1 : 0.2)
      // Warm: 0-90 or 300-360
      const isWarm = s.h <= 90 || s.h >= 300
      if (isWarm) warmScore += weight
      totalWeight += weight
    })
    const warmth = totalWeight === 0 ? 50 : Math.round((warmScore / totalWeight) * 100)

    // 2. Fun (Seria vs Divertida)
    let funScore = 0
    palette.forEach((s) => {
      // Fun colors are highly saturated and reasonably bright
      const factor = (s.s / 100) * (s.l / 100)
      funScore += factor
    })
    const avgFun = funScore / palette.length
    // Map avg [0, 0.5] to [0, 100] approximately
    const fun = Math.min(100, Math.round(avgFun * 180))

    // 3. Modern (Clásica vs Moderna)
    // Modern palettes tend to have higher overall saturation
    const avgSat = palette.reduce((acc, s) => acc + s.s, 0) / palette.length
    const modern = Math.round(avgSat)

    return { warmth, fun, modern }
  }, [palette])

  // Helper text generators
  const getWarmthText = (w: number) => {
    if (w > 75) return "Muy cálida, ideal para estimular energía y cercanía."
    if (w > 55) return "Ligeramente cálida, amigable y acogedora."
    if (w >= 45) return "Equilibrada, balance perfecto entre tonos fríos y cálidos."
    if (w > 25) return "Ligeramente fría, transmite profesionalismo y calma."
    return "Muy fría, perfecta para marcas corporativas, de salud o tecnología."
  }

  const getFunText = (f: number) => {
    if (f > 75) return "Muy divertida y vibrante, atrae la atención al instante."
    if (f > 55) return "Alegre y accesible, excelente para marcas de consumo."
    if (f >= 45) return "Intermedia, tiene toques de color pero mantiene la compostura."
    if (f > 25) return "Seria y estable, proyecta madurez y confianza."
    return "Muy seria, sobria y elegante. Ideal para lujo o B2B corporativo."
  }

  const getModernText = (m: number) => {
    if (m > 75) return "Muy moderna, colores saturados que destacan en entornos digitales."
    if (m > 55) return "Contemporánea, se siente actual y fresca."
    if (m >= 45) return "Atemporal, ni demasiado tradicional ni extremadamente vanguardista."
    if (m > 25) return "Clásica, colores más apagados y tradicionales."
    return "Muy clásica, tonos tierra o pasteles desaturados que evocan nostalgia."
  }

  return (
    <motion.div 
      className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm no-print"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      <div className="mb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Test de Personalidad
        </h3>
        <p className="mt-1.5 text-sm text-foreground/80">
          Así es como la psicología del color percibe tu paleta seleccionada.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Warmth Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-medium">
            <span className={warmth <= 45 ? "text-foreground" : "text-muted-foreground"}>Fría</span>
            <span className={warmth >= 55 ? "text-foreground" : "text-muted-foreground"}>Cálida</span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-orange-500 transition-all duration-500 ease-out" 
              style={{ width: `${warmth}%` }} 
            />
          </div>
          <p className="text-xs text-muted-foreground">{getWarmthText(warmth)}</p>
        </div>

        {/* Fun Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-medium">
            <span className={fun <= 45 ? "text-foreground" : "text-muted-foreground"}>Seria</span>
            <span className={fun >= 55 ? "text-foreground" : "text-muted-foreground"}>Divertida</span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-foreground transition-all duration-500 ease-out" 
              style={{ width: `${fun}%` }} 
            />
          </div>
          <p className="text-xs text-muted-foreground">{getFunText(fun)}</p>
        </div>

        {/* Modern Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-medium">
            <span className={modern <= 45 ? "text-foreground" : "text-muted-foreground"}>Clásica</span>
            <span className={modern >= 55 ? "text-foreground" : "text-muted-foreground"}>Moderna</span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-foreground transition-all duration-500 ease-out" 
              style={{ width: `${modern}%` }} 
            />
          </div>
          <p className="text-xs text-muted-foreground">{getModernText(modern)}</p>
        </div>
      </div>
    </motion.div>
  )
}

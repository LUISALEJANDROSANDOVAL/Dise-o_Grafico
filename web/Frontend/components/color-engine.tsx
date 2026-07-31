"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { ImageIcon, Pipette, BrainCircuit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type HSL, type Scheme, SCHEMES, hslToHex, hexToHsl, generatePalette } from "@/lib/color"
import type { Profile } from "@/components/rulec-header"
import { ImagePickerModal } from "@/components/image-picker-modal"

type Props = {
  base: HSL
  onBaseChange: (hsl: HSL) => void
  scheme: Scheme
  onSchemeChange: (s: Scheme) => void
  profile: Profile
  onShowAnalysis?: () => void
}

export function getColorPsychology(h: number) {
  if (h >= 345 || h < 15) return { 
    name: "Rojo", 
    meaning: "Energía, Pasión, Acción", 
    desc: "Excelente para marcas de comida, deportes o entretenimiento. Crea urgencia y llama la atención rápido.",
    fullDesc: "El rojo es un color intenso y emocional que estimula el apetito, incrementa el ritmo cardíaco y fomenta la acción impulsiva. En marketing, es la herramienta perfecta para ofertas de tiempo limitado o llamadas a la acción (CTA) porque transmite urgencia. Sin embargo, su uso excesivo puede resultar abrumador o interpretarse como agresivo o de peligro. Es ideal para industrias donde el movimiento y la emoción son clave." 
  }
  if (h >= 15 && h < 45) return { 
    name: "Naranja", 
    meaning: "Creatividad, Juventud, Aventura", 
    desc: "Ideal para marcas accesibles, divertidas o dirigidas a un público joven. Transmite calidez y amabilidad.",
    fullDesc: "El naranja combina la energía del rojo con la felicidad del amarillo. Es un color que invita a la interacción, proyecta entusiasmo y sugiere asequibilidad y valor. Es muy común en empresas de tecnología orientadas al consumidor, marcas de entretenimiento, y sectores creativos. Psicológicamente, anima a la sociabilidad y reduce la sensación de riesgo." 
  }
  if (h >= 45 && h < 75) return { 
    name: "Amarillo", 
    meaning: "Alegría, Optimismo, Claridad", 
    desc: "El primer color que procesa el ojo humano. Úsalo para destacar promociones, pero con moderación.",
    fullDesc: "El amarillo es el color de la luz solar, asociado directamente con la alegría, el intelecto y la energía. Atrapa la atención inmediatamente, por lo que es útil en señalización o para destacar elementos clave. No obstante, en grandes cantidades puede causar fatiga visual o ansiedad. En marcas, transmite optimismo, claridad y juventud, siendo popular en la industria del transporte y alimentos." 
  }
  if (h >= 75 && h < 160) return { 
    name: "Verde", 
    meaning: "Naturaleza, Crecimiento, Salud", 
    desc: "El color de la armonía y la tranquilidad. Perfecto para marcas ecológicas, financieras o de bienestar.",
    fullDesc: "El verde está profundamente ligado a la naturaleza y al dinero. Simboliza crecimiento, frescura, fertilidad y seguridad. Tiene un fuerte poder curativo a nivel psicológico y es el color más relajante para el ojo humano. Las marcas ecológicas o enfocadas en la salud lo utilizan para denotar naturalidad y bienestar, mientras que las corporaciones financieras lo asocian con estabilidad y prosperidad económica." 
  }
  if (h >= 160 && h < 260) return { 
    name: "Azul", 
    meaning: "Confianza, Seguridad, Lógica", 
    desc: "El color más usado corporativamente. Transmite fiabilidad y calma. Ideal para tecnología y finanzas.",
    fullDesc: "El azul transmite estabilidad, profesionalidad y confianza. Reduce el ritmo cardíaco y promueve la calma. Es el color favorito tanto para hombres como mujeres a nivel mundial. Es la elección dominante para bancos, aseguradoras, tecnología médica y redes sociales, porque sugiere seguridad, orden y lógica. En contraparte, rara vez se usa para alimentos porque suprime el apetito." 
  }
  if (h >= 260 && h < 315) return { 
    name: "Morado", 
    meaning: "Lujo, Sabiduría, Imaginación", 
    desc: "Asociado a lo premium y espiritual. Bueno para marcas de lujo, creatividad o productos innovadores.",
    fullDesc: "El morado combina la estabilidad del azul con la energía del rojo. Históricamente asociado con la realeza, transmite poder, nobleza, lujo y ambición. También está fuertemente vinculado a la creatividad, el misterio y la magia. En el diseño de marcas, los tonos más oscuros sugieren opulencia, mientras que los más claros (como la lavanda) evocan nostalgia, romance y delicadeza." 
  }
  if (h >= 315 && h < 345) return { 
    name: "Rosa", 
    meaning: "Dulzura, Empatía, Cuidado", 
    desc: "Suave y compasivo. Frecuentemente usado en belleza, cuidado personal y marcas que buscan cercanía.",
    fullDesc: "El rosa representa la compasión, la crianza y el amor. Relacionado tradicionalmente con lo femenino, transmite una sensación de calma y reduce sentimientos de ira y agresión. En el branding, los tonos pálidos proyectan inocencia y cuidado (ideal para productos infantiles o de belleza), mientras que los rosas intensos o magenta expresan rebeldía, energía moderna y diversión sin la agresividad del rojo." 
  }
  return { 
    name: "Neutro", 
    meaning: "Balance", 
    desc: "Un color que proporciona estructura y equilibrio.",
    fullDesc: "Los colores neutros (como los grises) son conservadores, formales y sofisticados. Pueden ser el fondo perfecto para hacer que otros colores destaquen, aportando una sensación de madurez, solidez y calma. Demasiado gris puede sentirse aburrido o deprimente, por lo que suele usarse en conjunto con tonos más vibrantes." 
  }
}

export function ColorEngine({ base, onBaseChange, scheme, onSchemeChange, profile, onShowAnalysis }: Props) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [pickerImageSrc, setPickerImageSrc] = useState<string | null>(null)

  const baseRef = useRef(base)
  useEffect(() => {
    baseRef.current = base
  }, [base])

  const [isDragging, setIsDragging] = useState(false)

  const lastAngleRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const velocityRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)

  const baseHex = hslToHex(base)
  const primaryPsycho = getColorPsychology(base.h)
  
  let secondaryHue = base.h
  if (scheme === "complementary") secondaryHue = (base.h + 180) % 360
  else if (scheme === "triad") secondaryHue = (base.h + 120) % 360
  else if (scheme === "analogous") secondaryHue = (base.h + 30) % 360
  
  const secondaryPsycho = getColorPsychology(secondaryHue)
  const secondaryHex = hslToHex({ h: secondaryHue, s: base.s, l: base.l })

  function stopInertia() {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    velocityRef.current = 0
  }

  function pickFromWheel(e: React.PointerEvent<HTMLDivElement>) {
    const el = wheelRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    let angle = (Math.atan2(dy, dx) * (180 / Math.PI) + 90) % 360
    if (angle < 0) angle += 360
    const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (rect.width / 2))
    onBaseChange({ h: Math.round(angle), s: Math.round(35 + dist * 60), l: baseRef.current.l })
    return angle
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    stopInertia()
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    const angle = pickFromWheel(e)
    if (angle !== null) {
      lastAngleRef.current = angle
      lastTimeRef.current = performance.now()
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      const angle = pickFromWheel(e)
      if (angle !== null) {
        const now = performance.now()
        if (lastAngleRef.current !== null && lastTimeRef.current !== null) {
          const dt = now - lastTimeRef.current
          if (dt > 0) {
            let diff = angle - lastAngleRef.current
            if (diff > 180) diff -= 360
            if (diff < -180) diff += 360
            velocityRef.current = diff / dt
          }
        }
        lastAngleRef.current = angle
        lastTimeRef.current = now
      }
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.releasePointerCapture(e.pointerId)
    setIsDragging(false)

    if (Math.abs(velocityRef.current) > 0.05) {
      let lastFrameTime = performance.now()
      const animateInertia = (nowTime: number) => {
        const dt = nowTime - lastFrameTime
        lastFrameTime = nowTime

        if (Math.abs(velocityRef.current) < 0.01) {
          stopInertia()
          return
        }

        velocityRef.current *= Math.pow(0.95, dt / 16)
        const deltaAngle = velocityRef.current * dt
        let nextH = (baseRef.current.h + deltaAngle) % 360
        if (nextH < 0) nextH += 360

        onBaseChange({
          ...baseRef.current,
          h: Math.round(nextH)
        })

        animationFrameRef.current = requestAnimationFrame(animateInertia)
      }
      animationFrameRef.current = requestAnimationFrame(animateInertia)
    } else {
      stopInertia()
    }
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // active palette for pointers
  const activePalette = generatePalette(base, scheme)

  // marker position on the ring
  const visualAngle = base.h
  const angleRad = ((visualAngle - 90) * Math.PI) / 180
  const radiusPct = 50 * (0.35 + (base.s / 100) * 0.6)

  const markerX = Number((50 + radiusPct * Math.cos(angleRad)).toFixed(4))
  const markerY = Number((50 + radiusPct * Math.sin(angleRad)).toFixed(4))

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Convert to ObjectURL and open the modal
    const url = URL.createObjectURL(file)
    setPickerImageSrc(url)
    
    // Reset input so the same file can be selected again
    e.target.value = ""
  }

  return (
    <section className="flex flex-col gap-6" aria-label="Motor de color">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Motor de color</h2>
        <span className="font-mono text-xs text-muted-foreground">{baseHex}</span>
      </div>

      {/* Chromatic wheel */}
      <div className="flex justify-center py-2">
        <motion.div
          ref={wheelRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          whileHover={isDragging ? { scale: 1.01 } : { scale: 1.03, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.35)" }}
          whileTap={isDragging ? { scale: 1.01 } : { scale: 0.99 }}
          animate={{ scale: isDragging ? 1.01 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative aspect-square w-56 max-w-full touch-none rounded-full sm:w-64 print-visible-wheel"
          style={{
            background:
              "conic-gradient(from 0deg, #ff0000 0deg, #ffff00 60deg, #00ff00 120deg, #00ffff 180deg, #0000ff 240deg, #ff00ff 300deg, #ff0000 360deg)",
            cursor: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Ccircle cx='12' cy='12' r='7' stroke='white' stroke-width='3' /%3E%3Ccircle cx='12' cy='12' r='7' stroke='black' stroke-width='1.5' /%3E%3C/svg%3E\") 12 12, crosshair",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          } as any}
          role="slider"
          aria-label="Círculo cromático: selecciona el tono base"
          aria-valuenow={base.h}
          aria-valuemin={0}
          aria-valuemax={360}
        >
          {/* SVG Pointers (Principal + Secundarios) */}
          <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible z-10">
            {activePalette.map((swatch, i) => {
              const isBase = i === 0;
              
              if (isBase) {
                // Línea principal (aguja elegante)
                return (
                  <line 
                    key={i}
                    x1="50" y1="50" x2={markerX} y2={markerY} 
                    className="stroke-foreground/20 dark:stroke-foreground/30" 
                    strokeWidth="0.6" 
                  />
                )
              }
              
              // Flechitas secundarias (más tenues y con puntitos pequeños)
              const angleRad = ((swatch.h - 90) * Math.PI) / 180
              const r = 50 * (0.35 + (swatch.s / 100) * 0.6)
              const x = Number((50 + r * Math.cos(angleRad)).toFixed(4))
              const y = Number((50 + r * Math.sin(angleRad)).toFixed(4))

              return (
                <g key={i}>
                  <line 
                    x1="50" y1="50" x2={x} y2={y} 
                    className="stroke-foreground/10 dark:stroke-foreground/10" 
                    strokeWidth="0.3" 
                  />
                  <circle 
                    cx={x} cy={y} 
                    r="1.2" 
                    fill={swatch.hex} 
                    className="stroke-background shadow-sm" 
                    strokeWidth="0.5" 
                  />
                </g>
              )
            })}
          </svg>

          {/* inner hole */}
          <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-background z-0" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" } as any}>
            <div
              className="size-12 rounded-full border border-border shadow-inner"
              style={{ backgroundColor: baseHex, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
              aria-hidden
            />
          </div>

          {/* Tiny center anchor dot */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/30 z-20" />

          {/* Premium Floating Marker */}
          <div
            className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-background shadow-md ring-1 ring-foreground/10 z-20 transition-transform duration-75"
            style={{ left: `${markerX}%`, top: `${markerY}%`, backgroundColor: baseHex, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
            aria-hidden
          />
        </motion.div>
      </div>

      {/* Lightness slider */}
      <div className="flex flex-col gap-1.5 no-print">
        <label htmlFor="lightness" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex justify-between items-center w-full">
          <span>Luminosidad</span>
          <span className="hidden print:inline font-mono text-[10px] text-muted-foreground uppercase">Nivel de brillo: {base.l}%</span>
        </label>
        <input
          id="lightness"
          type="range"
          min={20}
          max={80}
          value={base.l}
          onChange={(e) => onBaseChange({ ...base, l: Number(e.target.value) })}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground print:hidden"
        />
        {/* Static lightness gradient bar for print */}
        <div 
          className="hidden print:block h-2 w-full rounded-full"
          style={{
            background: `linear-gradient(to right, ${hslToHex({ h: base.h, s: base.s, l: 20 })}, ${hslToHex({ h: base.h, s: base.s, l: 50 })}, ${hslToHex({ h: base.h, s: base.s, l: 80 })})`,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        />
      </div>

      {/* Extract controls */}
      <div className="grid grid-cols-2 gap-2">
        <div className="relative">
          <input
            type="color"
            value={baseHex}
            onChange={(e) => onBaseChange(hexToHsl(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Selector de color"
          />
          <Button variant="outline" className="pointer-events-none w-full justify-start" tabIndex={-1}>
            <Pipette />
            Elegir color
          </Button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        <Button variant="outline" className="justify-start" onClick={() => fileRef.current?.click()}>
          <ImageIcon />
          Extraer de imagen
        </Button>
      </div>

      {/* Scheme pills */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Esquema de color
        </span>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Esquema de color">
          {SCHEMES.map((s) => {
            const previewPalette = generatePalette(base, s.id)
            return (
              <button
                key={s.id}
                role="radio"
                aria-checked={scheme === s.id}
                onClick={() => onSchemeChange(s.id)}
                className={cn(
                   "rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                   scheme === s.id
                     ? "border-foreground bg-foreground text-background"
                     : "border-border bg-card text-foreground hover:bg-muted",
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{profile === "entrepreneur" ? s.entrepreneur : s.designer}</span>
                  <div className="flex gap-0.5">
                    {previewPalette.map((p, i) => (
                      <span 
                        key={i} 
                        className="size-2 rounded-full border border-black/10 dark:border-white/10" 
                        style={{ backgroundColor: p.hex }} 
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
        
      {/* Psychology Context Module */}
      {profile === "entrepreneur" && (
        <div className="mt-2 flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full gap-2 border-indigo-200 bg-indigo-50/30 py-6 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 dark:border-indigo-900/50 dark:bg-indigo-950/10 dark:text-indigo-300 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-200"
            onClick={onShowAnalysis}
          >
            <BrainCircuit className="h-5 w-5" />
            <span className="font-semibold">Ver análisis psicológico completo</span>
          </Button>
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal 
        isOpen={!!pickerImageSrc}
        onClose={() => {
          if (pickerImageSrc) URL.revokeObjectURL(pickerImageSrc)
          setPickerImageSrc(null)
        }}
        imageSrc={pickerImageSrc}
        onColorExtracted={(hex) => {
          onBaseChange(hexToHsl(hex))
        }}
      />
    </section>
  )
}

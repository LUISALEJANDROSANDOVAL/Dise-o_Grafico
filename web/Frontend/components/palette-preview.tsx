"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, Copy, Check, Wifi, Battery, Signal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type HSL,
  type Swatch,
  type ColorblindMode,
  contrastLevel,
  readableText,
  simulate,
  rgbString,
  cmykString,
  hslToHex,
} from "@/lib/color"
import type { Profile } from "@/components/rulec-header"

type Props = {
  palette: Swatch[]
  colorblind: ColorblindMode
  profile: Profile
  onSwatchChange: (index: number, hsl: HSL) => void
  base: HSL
}

export function PalettePreview({ palette, colorblind, profile, onSwatchChange, base }: Props) {
  const display = palette.map((s) => simulate(s.hex, colorblind))

  // Roles derived from the palette
  const brand = simulate(hslToHex(base), colorblind)
  const accent = display[3]
  const dark = display[4]
  const light = display[0]

  return (
    <motion.section
      className="flex flex-col gap-8"
      aria-label="Validación y mockups"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
    >
      <AnimatePresence mode="wait">
        <Accessibility key={brand} brand={brand} profile={profile} />
      </AnimatePresence>

      <motion.div variants={sectionVariant}>
        <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Mockups en tiempo real
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <BusinessCard dark={dark} light={light} accent={accent} brand={brand} />
          <MobileApp brand={brand} accent={accent} light={light} dark={dark} />
        </div>
      </motion.div>

      <Swatches palette={palette} display={display} profile={profile} onSwatchChange={onSwatchChange} />
    </motion.section>
  )
}

const sectionVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
}

function Swatches({
  palette,
  display,
  profile,
  onSwatchChange,
}: {
  palette: Swatch[]
  display: string[]
  profile: Profile
  onSwatchChange: (index: number, hsl: HSL) => void
}) {
  const [copied, setCopied] = useState<string | null>(null)
  const isDesigner = profile === "designer"

  function copy(hex: string) {
    navigator.clipboard?.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200)
  }

  return (
    <motion.div variants={sectionVariant}>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Paleta generada</h3>
        <span className="font-mono text-xs text-muted-foreground">{palette.length} tonos</span>
      </div>
      <div className={cn("grid gap-2", isDesigner ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-5")}>
        {palette.map((s, i) => (
          <motion.div
            key={i}
            layout
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
          >
            <button
              onClick={() => copy(s.hex)}
              className="group relative block h-16 w-full text-left sm:h-24"
              aria-label={`Copiar ${s.hex}`}
            >
              {/* Animated color layer — cross-fades when the scheme changes */}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={display[i]}
                  className="absolute inset-0 block"
                  style={{ backgroundColor: display[i] }}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </AnimatePresence>
              <span className="absolute right-1 top-1 z-10 rounded bg-background/85 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                {copied === s.hex ? (
                  <Check className="size-3 text-foreground" />
                ) : (
                  <Copy className="size-3 text-foreground" />
                )}
              </span>
            </button>

            <div className="flex flex-col gap-1 px-1.5 py-1.5">
              <span className="font-mono text-[10px] text-foreground sm:text-xs">{s.hex}</span>

              {isDesigner && (
                <>
                  <div className="flex flex-col gap-0.5 font-mono text-[9px] leading-tight text-muted-foreground">
                    <span>RGB {rgbString(s.hex)}</span>
                    <span>CMYK {cmykString(s.hex)}</span>
                  </div>
                  <DesignerSliders index={i} swatch={s} onChange={onSwatchChange} />
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function DesignerSliders({
  index,
  swatch,
  onChange,
}: {
  index: number
  swatch: Swatch
  onChange: (index: number, hsl: HSL) => void
}) {
  const rows: { key: keyof HSL; label: string; max: number }[] = [
    { key: "h", label: "M", max: 360 },
    { key: "s", label: "S", max: 100 },
    { key: "l", label: "L", max: 100 },
  ]
  return (
    <div className="mt-1 flex flex-col gap-1.5 border-t border-border pt-1.5">
      {rows.map((row) => (
        <label key={row.key} className="flex items-center gap-1.5">
          <span className="w-2.5 font-mono text-[9px] text-muted-foreground">{row.label}</span>
          <input
            type="range"
            min={0}
            max={row.max}
            value={swatch[row.key]}
            onChange={(e) => onChange(index, { ...swatch, [row.key]: Number(e.target.value) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
            aria-label={`Ajustar ${row.label} del color ${index + 1}`}
          />
          <span className="w-6 text-right font-mono text-[9px] tabular-nums text-muted-foreground">
            {swatch[row.key]}
          </span>
        </label>
      ))}
    </div>
  )
}

function Accessibility({ brand, profile }: { brand: string; profile: Profile }) {
  // Evaluate readable body text using the brand color over a light background
  const level = contrastLevel(brand, "#FFFFFF")
  const ok = level.ratio >= 4.5

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, height: 0, y: -8 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="overflow-hidden"
    >
      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border px-3.5 py-3",
          ok
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
            : "border-orange-500/50 bg-orange-500/15 text-orange-900 dark:text-orange-200",
        )}
      >
        {ok ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        )}
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold leading-snug">
            {ok
              ? profile === "entrepreneur"
                ? "El texto se lee bien sobre fondo claro."
                : `Contraste correcto — ${level.label} (${level.ratio}:1)`
              : profile === "entrepreneur"
                ? "Alerta de legibilidad: el contraste del texto es bajo."
                : `Contraste insuficiente — ${level.ratio}:1 (mín. 4.5:1)`}
          </p>
          <p className="text-xs opacity-80">
            {profile === "entrepreneur"
              ? "Comparamos tu color principal como texto sobre blanco."
              : "WCAG 2.1 · color de marca sobre #FFFFFF"}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function BusinessCard({
  dark,
  accent,
  brand,
}: {
  dark: string
  light: string
  accent: string
  brand: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Tarjeta de presentación
      </span>
      <motion.div
        layout
        animate={{ backgroundColor: dark, color: readableText(dark) }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex aspect-[1.75/1] flex-col justify-between rounded-lg border border-border p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">Estudio Nova</span>
          <motion.span
            className="size-6 rounded"
            animate={{ backgroundColor: accent }}
            transition={{ duration: 0.4 }}
            aria-hidden
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Camila Rojas</span>
          <span className="text-xs opacity-80">Directora creativa</span>
          <motion.span
            className="mt-1 h-1 w-12 rounded-full"
            animate={{ backgroundColor: brand }}
            transition={{ duration: 0.4 }}
            aria-hidden
          />
        </div>
      </motion.div>
    </div>
  )
}

function MobileApp({
  brand,
  accent,
  light,
}: {
  brand: string
  accent: string
  light: string
  dark: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Interfaz de app móvil
      </span>
      <motion.div
        layout
        animate={{ backgroundColor: light, color: readableText(light) }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex aspect-[1.75/1] flex-col overflow-hidden rounded-lg border border-border shadow-sm"
      >
        {/* status bar */}
        <div className="flex items-center justify-between px-3 pt-2 text-[9px] opacity-70">
          <span className="font-mono">9:41</span>
          <span className="flex items-center gap-1">
            <Signal className="size-2.5" />
            <Wifi className="size-2.5" />
            <Battery className="size-2.5" />
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 px-3">
          <span className="text-sm font-semibold leading-tight">Bienvenida de vuelta</span>
          <span className="text-[11px] leading-snug opacity-70">
            Tu resumen está listo para revisar hoy.
          </span>
          <div className="mt-1 flex items-center gap-2">
            <motion.button
              className="rounded-md px-3 py-1.5 text-xs font-semibold"
              animate={{ backgroundColor: brand, color: readableText(brand) }}
              transition={{ duration: 0.4 }}
            >
              Empezar
            </motion.button>
            <motion.span
              className="size-6 rounded-full"
              animate={{ backgroundColor: accent }}
              transition={{ duration: 0.4 }}
              aria-hidden
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

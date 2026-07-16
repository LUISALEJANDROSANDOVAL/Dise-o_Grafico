"use client"

import type React from "react"
import { useRef } from "react"
import { motion } from "framer-motion"
import { ImageIcon, Pipette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type HSL, type Scheme, SCHEMES, hslToHex, hexToHsl } from "@/lib/color"
import type { Profile } from "@/components/rulec-header"

type Props = {
  base: HSL
  onBaseChange: (hsl: HSL) => void
  scheme: Scheme
  onSchemeChange: (s: Scheme) => void
  profile: Profile
}

export function ColorEngine({ base, onBaseChange, scheme, onSchemeChange, profile }: Props) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const baseHex = hslToHex(base)

  function pickFromWheel(e: React.PointerEvent<HTMLDivElement>) {
    const el = wheelRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    if (angle < 0) angle += 360
    const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (rect.width / 2))
    onBaseChange({ h: Math.round(angle), s: Math.round(35 + dist * 60), l: base.l })
  }

  // marker position on the ring
  const angleRad = ((base.h - 90) * Math.PI) / 180
  const radiusPct = 50 * (0.35 + (base.s / 100) * 0.6)
  const markerX = 50 + radiusPct * Math.cos(angleRad)
  const markerY = 50 + radiusPct * Math.sin(angleRad)

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const size = 40
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(img, 0, 0, size, size)
      const { data } = ctx.getImageData(0, 0, size, size)
      let r = 0
      let g = 0
      let b = 0
      let count = 0
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
      }
      const toHex = (v: number) =>
        Math.round(v / count)
          .toString(16)
          .padStart(2, "0")
      onBaseChange(hexToHsl(`#${toHex(r)}${toHex(g)}${toHex(b)}`))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
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
          onPointerDown={pickFromWheel}
          whileHover={{ scale: 1.03, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.35)" }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative aspect-square w-56 max-w-full cursor-crosshair touch-none rounded-full sm:w-64"
          style={{
            background:
              "conic-gradient(from 90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
          }}
          role="slider"
          aria-label="Círculo cromático: selecciona el tono base"
          aria-valuenow={base.h}
          aria-valuemin={0}
          aria-valuemax={360}
        >
          {/* inner hole */}
          <div className="absolute inset-[22%] flex items-center justify-center rounded-full bg-background">
            <div
              className="size-12 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: baseHex }}
              aria-hidden
            />
          </div>
          {/* marker */}
          <div
            className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background shadow-md ring-1 ring-foreground/20"
            style={{ left: `${markerX}%`, top: `${markerY}%`, backgroundColor: baseHex }}
            aria-hidden
          />
        </motion.div>
      </div>

      {/* Lightness slider */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="lightness" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Luminosidad
        </label>
        <input
          id="lightness"
          type="range"
          min={20}
          max={80}
          value={base.l}
          onChange={(e) => onBaseChange({ ...base, l: Number(e.target.value) })}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
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
          {SCHEMES.map((s) => (
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
              {profile === "entrepreneur" ? s.entrepreneur : s.designer}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

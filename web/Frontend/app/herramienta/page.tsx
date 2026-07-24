"use client"

import { useEffect, useMemo, useState, Suspense, useTransition, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { RulecHeader, type Profile } from "@/components/rulec-header"
import { ColorEngine } from "@/components/color-engine"
import { PalettePreview } from "@/components/palette-preview"
import { PsychologyReport } from "@/components/psychology-report"
import { ToolBar } from "@/components/tool-bar"
import { type HSL, type Scheme, type ColorblindMode, type Swatch, generatePalette, hslToHex, hexToHsl } from "@/lib/color"
import { savePalette } from "@/app/actions"
import { createClient } from "@/utils/supabase/client"
import { useTheme } from "@/hooks/useTheme"

function HerramientaContent() {
  const searchParams = useSearchParams()
  const idParam = searchParams.get("id")
  const colorParam = searchParams.get("color")
  const schemeParam = searchParams.get("scheme")
  const pParam = searchParams.get("p")
  const initialProfile = (searchParams.get("profile") as Profile) || "entrepreneur"

  const [theme, setTheme] = useTheme()
  const [profile, setProfile] = useState<Profile>(initialProfile)
  
  const initialBase = useMemo(() => {
    if (colorParam) {
      const hex = colorParam.startsWith("#") ? colorParam : `#${colorParam}`
      try {
        return hexToHsl(hex)
      } catch (e) {
        // En caso de error, volver al default
      }
    }
    return { h: 18, s: 78, l: 52 }
  }, [colorParam])

  const [base, setBase] = useState<HSL>(initialBase)
  const [scheme, setScheme] = useState<Scheme>((schemeParam as Scheme) || "analogous")
  const [colorblind, setColorblind] = useState<ColorblindMode>("none")
  
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)
  const [isPending, startTransition] = useTransition()
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  const generated = useMemo(() => generatePalette(base, scheme), [base, scheme])

  // Parse shared palette from URL
  const initialSharedPalette = useMemo(() => {
    if (!pParam) return null
    try {
      const hexes = pParam.split("-").map(h => `#${h}`)
      return hexes.map(hex => ({ ...hexToHsl(hex), hex }))
    } catch {
      return null
    }
  }, [pParam])

  // Editable copy — lets Designer profile tweak individual swatches.
  const [palette, setPalette] = useState<Swatch[]>(initialSharedPalette || generated)
  const isFirstRender = useRef(true)

  // Reset manual edits whenever the base color or scheme changes, except on first load with shared link.
  useEffect(() => {
    if (isFirstRender.current && initialSharedPalette) {
      isFirstRender.current = false
      // Set the base color to the main color of the shared palette so the wheel matches somewhat
      if (initialSharedPalette.length > 0) {
        setBase(hexToHsl(initialSharedPalette[0].hex))
      }
      return
    }
    setPalette(generated)
    isFirstRender.current = false
  }, [generated, initialSharedPalette])

  function handleSwatchChange(index: number, hsl: HSL) {
    setPalette((prev) =>
      prev.map((s, i) => (i === index ? { ...hsl, hex: hslToHex(hsl) } : s)),
    )
  }

  // Apply theme class to <html>


  function handleExport() {
    window.print()
  }

  function handleSave() {
    if (!session) {
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return
    }
    
    startTransition(async () => {
      try {
        await savePalette({
          id: idParam || undefined,
          baseColor: hslToHex(base),
          scheme: scheme,
          swatches: JSON.stringify(palette.map(s => s.hex))
        })
        alert("¡Paleta guardada exitosamente en Mis Paletas!")
      } catch (e) {
        alert("Ocurrió un error al guardar la paleta.")
      }
    })
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <RulecHeader
        profile={profile}
        onProfileChange={setProfile}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      />

      <main className="mx-auto grid w-full max-w-[100rem] flex-1 gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[24rem_1fr] lg:gap-12 lg:px-8 xl:grid-cols-[26rem_1fr]">
        {/* Left column — fixed work area */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-6">
            <h1 className="text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Construye la paleta de tu marca.
            </h1>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {profile === "entrepreneur"
                ? "Elige un color, combínalo y mira cómo luce tu marca al instante — sin conocimientos técnicos."
                : "Genera esquemas cromáticos, valida el contraste WCAG y exporta tu kit de marca."}
            </p>
          </div>
          <ColorEngine
            base={base}
            onBaseChange={setBase}
            scheme={scheme}
            onSchemeChange={setScheme}
            profile={profile}
            onShowAnalysis={() => setShowFullAnalysis(true)}
          />
        </aside>

        {/* Right column — scrollable results area */}
        <section className="min-w-0">
          {showFullAnalysis ? (
            <PsychologyReport
              base={base}
              scheme={scheme}
              onClose={() => setShowFullAnalysis(false)}
            />
          ) : (
            <PalettePreview
              palette={palette}
              colorblind={colorblind}
              profile={profile}
              onSwatchChange={handleSwatchChange}
            />
          )}
        </section>
      </main>

      <ToolBar
        colorblind={colorblind}
        onColorblindChange={setColorblind}
        palette={palette}
        onExport={handleExport}
        onSave={handleSave}
        isSaving={isPending}
      />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh flex-col bg-background" />}>
      <HerramientaContent />
    </Suspense>
  )
}

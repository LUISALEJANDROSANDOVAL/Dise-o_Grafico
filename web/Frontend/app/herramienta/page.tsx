"use client"

import { useEffect, useMemo, useState, Suspense, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { RulecHeader, type Profile } from "@/components/rulec-header"
import { ColorEngine } from "@/components/color-engine"
import { PalettePreview } from "@/components/palette-preview"
import { ToolBar } from "@/components/tool-bar"
import { type HSL, type Scheme, type ColorblindMode, type Swatch, generatePalette, hslToHex } from "@/lib/color"
import { savePalette } from "@/app/actions"
import { createClient } from "@/utils/supabase/client"

function HerramientaContent() {
  const searchParams = useSearchParams()
  const initialProfile = (searchParams.get("profile") as Profile) || "entrepreneur"

  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [base, setBase] = useState<HSL>({ h: 18, s: 78, l: 52 })
  const [scheme, setScheme] = useState<Scheme>("analogous")
  const [colorblind, setColorblind] = useState<ColorblindMode>("none")
  
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [supabase.auth])

  const generated = useMemo(() => generatePalette(base, scheme), [base, scheme])
  // Editable copy — lets Designer profile tweak individual swatches.
  const [palette, setPalette] = useState<Swatch[]>(generated)

  // Reset manual edits whenever the base color or scheme changes.
  useEffect(() => {
    setPalette(generated)
  }, [generated])

  function handleSwatchChange(index: number, hsl: HSL) {
    setPalette((prev) =>
      prev.map((s, i) => (i === index ? { ...hsl, hex: hslToHex(hsl) } : s)),
    )
  }

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.classList.toggle("light", theme === "light")
  }, [theme])

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
          />
        </aside>

        {/* Right column — scrollable results area */}
        <section className="min-w-0">
          <PalettePreview
            palette={palette}
            colorblind={colorblind}
            profile={profile}
            onSwatchChange={handleSwatchChange}
          />
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

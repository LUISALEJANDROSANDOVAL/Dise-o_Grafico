"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle2, AlertTriangle, Wand2, Type, Loader2, Sparkles, Search, X } from "lucide-react"
import Link from "next/link"
import { RulecHeader, type Profile } from "@/components/rulec-header"
import { generateNameIdeas, getFontAdviceAI } from "@/app/actions/gemini"
import { useTheme } from "@/hooks/useTheme"

// Catálogo extenso de Google Fonts con categorías
const ALL_FONTS: { id: string; name: string; style: string; category: string }[] = [
  // Sans-Serif
  { id: "Inter", name: "Inter", style: "Sans-Serif Moderna", category: "Sans-Serif" },
  { id: "Roboto", name: "Roboto", style: "Sans-Serif Neutra", category: "Sans-Serif" },
  { id: "Poppins", name: "Poppins", style: "Sans-Serif Amigable", category: "Sans-Serif" },
  { id: "Nunito", name: "Nunito", style: "Sans-Serif Redondeada", category: "Sans-Serif" },
  { id: "Montserrat", name: "Montserrat", style: "Sans-Serif Geométrica", category: "Sans-Serif" },
  { id: "Raleway", name: "Raleway", style: "Sans-Serif Elegante", category: "Sans-Serif" },
  { id: "Lato", name: "Lato", style: "Sans-Serif Profesional", category: "Sans-Serif" },
  { id: "Open Sans", name: "Open Sans", style: "Sans-Serif Legible", category: "Sans-Serif" },
  { id: "Josefin Sans", name: "Josefin Sans", style: "Sans-Serif Retro", category: "Sans-Serif" },
  { id: "DM Sans", name: "DM Sans", style: "Sans-Serif Minimalista", category: "Sans-Serif" },
  { id: "Outfit", name: "Outfit", style: "Sans-Serif Contemporánea", category: "Sans-Serif" },
  { id: "Plus Jakarta Sans", name: "Plus Jakarta Sans", style: "Sans-Serif Premium", category: "Sans-Serif" },
  { id: "Urbanist", name: "Urbanist", style: "Sans-Serif Urbana", category: "Sans-Serif" },
  { id: "Figtree", name: "Figtree", style: "Sans-Serif Versátil", category: "Sans-Serif" },
  // Serif
  { id: "Playfair Display", name: "Playfair Display", style: "Serif de Lujo", category: "Serif" },
  { id: "Cinzel", name: "Cinzel", style: "Serif Clásica", category: "Serif" },
  { id: "EB Garamond", name: "EB Garamond", style: "Serif Editorial", category: "Serif" },
  { id: "Lora", name: "Lora", style: "Serif Literaria", category: "Serif" },
  { id: "Merriweather", name: "Merriweather", style: "Serif Formal", category: "Serif" },
  { id: "Cormorant Garamond", name: "Cormorant Garamond", style: "Serif de Alta Moda", category: "Serif" },
  { id: "Libre Baskerville", name: "Libre Baskerville", style: "Serif Tradicional", category: "Serif" },
  { id: "DM Serif Display", name: "DM Serif Display", style: "Serif Display Moderna", category: "Serif" },
  { id: "Spectral", name: "Spectral", style: "Serif Digital", category: "Serif" },
  { id: "Crimson Pro", name: "Crimson Pro", style: "Serif Académica", category: "Serif" },
  // Display / Decorativa
  { id: "Oswald", name: "Oswald", style: "Display Fuerte", category: "Display" },
  { id: "Bebas Neue", name: "Bebas Neue", style: "Display Impacto", category: "Display" },
  { id: "Anton", name: "Anton", style: "Display Condensada", category: "Display" },
  { id: "Black Han Sans", name: "Black Han Sans", style: "Display Bold", category: "Display" },
  { id: "Righteous", name: "Righteous", style: "Display Retro", category: "Display" },
  { id: "Fredoka One", name: "Fredoka One", style: "Display Divertida", category: "Display" },
  { id: "Boogaloo", name: "Boogaloo", style: "Display Casual", category: "Display" },
  { id: "Bangers", name: "Bangers", style: "Display Cómic", category: "Display" },
  { id: "Abril Fatface", name: "Abril Fatface", style: "Display Pesada", category: "Display" },
  { id: "Black Ops One", name: "Black Ops One", style: "Display Militar", category: "Display" },
  // Script / Manuscrita
  { id: "Pacifico", name: "Pacifico", style: "Script Playful", category: "Script" },
  { id: "Dancing Script", name: "Dancing Script", style: "Script Elegante", category: "Script" },
  { id: "Great Vibes", name: "Great Vibes", style: "Script Caligráfica", category: "Script" },
  { id: "Sacramento", name: "Sacramento", style: "Script Delicada", category: "Script" },
  { id: "Caveat", name: "Caveat", style: "Script Manuscrita", category: "Script" },
  { id: "Parisienne", name: "Parisienne", style: "Script Francesa", category: "Script" },
  { id: "Satisfy", name: "Satisfy", style: "Script Moderna", category: "Script" },
  // Monospace / Técnica
  { id: "Space Mono", name: "Space Mono", style: "Monospace Espacial", category: "Monospace" },
  { id: "IBM Plex Mono", name: "IBM Plex Mono", style: "Monospace Corporativa", category: "Monospace" },
  { id: "Source Code Pro", name: "Source Code Pro", style: "Monospace Código", category: "Monospace" },
  { id: "JetBrains Mono", name: "JetBrains Mono", style: "Monospace Dev", category: "Monospace" },
  { id: "Fira Code", name: "Fira Code", style: "Monospace Ligaduras", category: "Monospace" },
]

const CATEGORIES = ["Todas", "Sans-Serif", "Serif", "Display", "Script", "Monospace"]

// Hook para cargar fuentes de Google de forma dinámica
function useGoogleFont(fontName: string) {
  useEffect(() => {
    if (!fontName) return
    const id = `gfont-${fontName.replace(/\s+/g, "-")}`
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700&display=swap`
    document.head.appendChild(link)
  }, [fontName])
  return fontName ? `'${fontName}', sans-serif` : "inherit"
}

export default function NamingCreatorPage() {
  const [theme, setTheme] = useTheme()
  const [profile, setProfile] = useState<Profile>("entrepreneur")

  const [focus, setFocus] = useState("")
  const [namingIdea, setNamingIdea] = useState("")
  const [selectedFont, setSelectedFont] = useState(ALL_FONTS[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Todas")

  const [isGeneratingNames, setIsGeneratingNames] = useState(false)
  const [generatedNames, setGeneratedNames] = useState<string[]>([])

  const [isAdvising, setIsAdvising] = useState(false)
  const [fontAdvice, setFontAdvice] = useState<{ isGood: boolean; advice: string } | null>(null)

  // Carga la fuente seleccionada dinámicamente
  const fontFamilyStyle = useGoogleFont(selectedFont.name)

  // Carga las fuentes de las tarjetas visibles
  const filteredFonts = useMemo(() => {
    let fonts = ALL_FONTS
    if (activeCategory !== "Todas") {
      fonts = fonts.filter((f) => f.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      fonts = fonts.filter(
        (f) => f.name.toLowerCase().includes(q) || f.style.toLowerCase().includes(q)
      )
    }
    return fonts
  }, [searchQuery, activeCategory])

  // Pre-carga todas las fuentes filtradas
  useEffect(() => {
    filteredFonts.forEach((font) => {
      const id = `gfont-${font.name.replace(/\s+/g, "-")}`
      if (document.getElementById(id)) return
      const link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.name)}:wght@400;700&display=swap`
      document.head.appendChild(link)
    })
  }, [filteredFonts])

  const handleGenerateNames = async () => {
    if (focus.trim().length < 5) return alert("Escribe un poco más sobre tu empresa primero.")
    setIsGeneratingNames(true)
    const ideas = await generateNameIdeas(focus)
    setGeneratedNames(ideas)
    if (ideas.length > 0 && !namingIdea) setNamingIdea(ideas[0])
    setIsGeneratingNames(false)
  }

  const handleEvaluateFont = async () => {
    if (focus.trim().length < 10) {
      setFontAdvice({ isGood: true, advice: "Escribe al menos 10 caracteres sobre el enfoque de tu empresa para evaluar la tipografía." })
      return
    }
    setIsAdvising(true)
    const result = await getFontAdviceAI(focus, selectedFont.name, selectedFont.style)
    setFontAdvice(result)
    setIsAdvising(false)
  }

  useEffect(() => {
    setFontAdvice(null)
  }, [selectedFont])

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-950 dark:bg-[#0a0a0a] dark:text-slate-50">
      <RulecHeader
        profile={profile}
        onProfileChange={setProfile}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        hideProfileToggle={true}
      />

      <main className="mx-auto flex w-full max-w-full flex-col gap-4 px-4 py-4 md:px-8 lg:px-16 md:py-6 h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-1">
          <Link href="/elegir-nombre" className="inline-flex w-fit items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-2">
            <ArrowLeft className="h-4 w-4" /> Volver a los consejos
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Taller de <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Naming y Tipografía</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Usa Inteligencia Artificial para generar ideas de nombres y evaluar psicológicamente tus decisiones tipográficas.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 flex-1 min-h-0">
          {/* Panel izquierdo */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 overflow-y-auto custom-scrollbar">
            {/* Paso 1 */}
            <div className="flex flex-col gap-2">
              <label htmlFor="focus" className="text-sm font-semibold tracking-tight">1. ¿De qué trata tu empresa?</label>
              <p className="text-xs text-slate-500 dark:text-slate-400">Nuestro asesor inteligente usará esto para recomendarte fuentes y generar nombres.</p>
              <textarea
                id="focus"
                rows={2}
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="Ej: Un despacho de abogados corporativo, una marca de joyería moderna, un videojuego retro..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-transparent p-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:focus:border-blue-500"
              />
            </div>

            {/* Paso 2 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="nameIdea" className="text-sm font-semibold tracking-tight">2. Tu idea de Nombre</label>
                <button
                  onClick={handleGenerateNames}
                  disabled={isGeneratingNames}
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                >
                  {isGeneratingNames ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  Auto Generar
                </button>
              </div>

              {generatedNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {generatedNames.map((name, i) => (
                    <button
                      key={i}
                      onClick={() => setNamingIdea(name)}
                      className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-blue-700 hover:border-blue-500 dark:border-blue-900/50 dark:bg-black/50 dark:text-blue-300 dark:hover:border-blue-500"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <Wand2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="nameIdea"
                  type="text"
                  value={namingIdea}
                  onChange={(e) => setNamingIdea(e.target.value)}
                  placeholder="Escribe o selecciona un nombre..."
                  className="w-full rounded-xl border border-slate-200 bg-transparent py-2 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:focus:border-blue-500"
                />
              </div>
            </div>

            {/* Paso 3: Catálogo de fuentes con buscador */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold tracking-tight">3. Catálogo de Google Fonts</label>

              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar fuente... (ej: Roboto, Serif, Script)"
                  className="w-full rounded-xl border border-slate-200 bg-transparent py-2 pl-9 pr-9 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filtros por categoría */}
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Contador */}
              <p className="text-xs text-slate-400">{filteredFonts.length} fuentes encontradas</p>

              {/* Grid de fuentes */}
              <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
                {filteredFonts.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center justify-center py-8 text-slate-400">
                    <Search className="h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No se encontraron fuentes para "{searchQuery}"</p>
                  </div>
                ) : (
                  filteredFonts.map((font) => (
                    <label
                      key={font.id}
                      className={`flex cursor-pointer flex-col justify-center rounded-xl border p-3 transition-all ${
                        selectedFont.id === font.id
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500"
                          : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="fontStyle"
                          value={font.id}
                          checked={selectedFont.id === font.id}
                          onChange={() => setSelectedFont(font)}
                          className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex flex-col min-w-0">
                          <span
                            className="text-sm font-medium truncate"
                            style={{ fontFamily: `'${font.name}', sans-serif` }}
                          >
                            {font.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 ml-6 truncate">{font.style}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Panel derecho: Vista Previa + Asesor */}
          <div className="flex flex-col gap-4 min-h-0">
            <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white/50 p-6 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 min-h-[150px] overflow-hidden">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Type className="h-3.5 w-3.5" /> Vista Previa · {selectedFont.name}
              </span>
              <h2
                className="text-4xl md:text-5xl break-words max-w-full leading-tight transition-all duration-300"
                style={{ fontFamily: fontFamilyStyle }}
              >
                {namingIdea.trim() || "Tu Marca"}
              </h2>
              <p className="mt-3 text-xs text-slate-400">{selectedFont.style}</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleEvaluateFont}
                disabled={isAdvising || focus.trim().length < 10}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {isAdvising ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Consultar Asesor Tipográfico
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isAdvising ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/50 p-5 dark:border-slate-800 dark:bg-black/40"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm font-medium animate-pulse text-slate-600 dark:text-slate-400">Analizando la combinación tipográfica...</span>
                </motion.div>
              ) : fontAdvice ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col gap-3 rounded-2xl border p-5 ${
                    fontAdvice.isGood
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20"
                      : "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {fontAdvice.isGood ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    )}
                    <h3 className={`font-semibold ${fontAdvice.isGood ? "text-emerald-900 dark:text-emerald-300" : "text-amber-900 dark:text-amber-300"}`}>
                      Evaluación Tipográfica
                    </h3>
                  </div>
                  <div className={`text-sm leading-relaxed ${fontAdvice.isGood ? "text-emerald-800 dark:text-emerald-200/80" : "text-amber-800 dark:text-amber-200/80"}`}>
                    {fontAdvice.advice.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-2 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

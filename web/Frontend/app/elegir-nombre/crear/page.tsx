"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle2, AlertTriangle, Wand2, Type, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { RulecHeader, type Profile } from "@/components/rulec-header"
import { Inter, Playfair_Display, Space_Mono, Pacifico, Cinzel, Oswald } from "next/font/google"
import { generateNameIdeas, getFontAdviceAI } from "@/app/actions/gemini"

// Configuramos las fuentes
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] })
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] })
const pacifico = Pacifico({ subsets: ["latin"], weight: ["400"] })
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] })
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] })

const FONT_STYLES = [
  { id: "inter", name: "Inter", style: "Sans-Serif (Moderna)", className: inter.className },
  { id: "playfair", name: "Playfair Display", style: "Serif (Lujo)", className: playfair.className },
  { id: "cinzel", name: "Cinzel", style: "Serif Clásica (Autoridad)", className: cinzel.className },
  { id: "oswald", name: "Oswald", style: "Display (Fuerte)", className: oswald.className },
  { id: "pacifico", name: "Pacifico", style: "Script (Creativa)", className: pacifico.className },
  { id: "space-mono", name: "Space Mono", style: "Monospace (Técnica)", className: spaceMono.className },
]

import { useTheme } from "@/hooks/useTheme"

export default function NamingCreatorPage() {
  const [theme, setTheme] = useTheme()
  const [profile, setProfile] = useState<Profile>("entrepreneur")
  
  const [focus, setFocus] = useState("")
  const [namingIdea, setNamingIdea] = useState("")
  const [selectedFont, setSelectedFont] = useState(FONT_STYLES[0])

  const [isGeneratingNames, setIsGeneratingNames] = useState(false)
  const [generatedNames, setGeneratedNames] = useState<string[]>([])
  
  const [isAdvising, setIsAdvising] = useState(false)
  const [fontAdvice, setFontAdvice] = useState<{isGood: boolean, advice: string} | null>(null)

  // Generar nombres con IA
  const handleGenerateNames = async () => {
    if (focus.trim().length < 5) return alert("Escribe un poco más sobre tu empresa primero.")
    setIsGeneratingNames(true)
    const ideas = await generateNameIdeas(focus)
    setGeneratedNames(ideas)
    if (ideas.length > 0 && !namingIdea) {
      setNamingIdea(ideas[0])
    }
    setIsGeneratingNames(false)
  }

  // Evaluar tipografía de forma manual
  const handleEvaluateFont = async () => {
    if (focus.trim().length < 10) {
      setFontAdvice({ isGood: true, advice: "Escribe al menos 10 caracteres sobre el enfoque de tu empresa para que podamos evaluar si la tipografía elegida es correcta." })
      return
    }

    setIsAdvising(true)
    const result = await getFontAdviceAI(focus, selectedFont.name, selectedFont.style)
    setFontAdvice(result)
    setIsAdvising(false)
  }

  // Si cambia la fuente elegida, escondemos el consejo previo para obligarlo a evaluar de nuevo
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
          {/* Formulario */}
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 overflow-y-auto custom-scrollbar">
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold tracking-tight">3. Catálogo de Google Fonts</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_STYLES.map(font => (
                  <label key={font.id} className={`flex cursor-pointer flex-col justify-center rounded-lg border p-2 transition-colors ${selectedFont.id === font.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50'}`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fontStyle"
                        value={font.id}
                        checked={selectedFont.id === font.id}
                        onChange={() => setSelectedFont(font)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex flex-col">
                        <span className={`text-base ${font.className}`}>{font.name}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 ml-6">{font.style}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Vista Previa y Asesor */}
          <div className="flex flex-col gap-4 min-h-0">
            <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white/50 p-6 text-center shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/40 min-h-[150px] overflow-hidden">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Type className="h-3.5 w-3.5" /> Vista Previa
              </span>
              <h2 className={`text-4xl md:text-5xl break-words max-w-full leading-tight ${selectedFont.className}`}>
                {namingIdea.trim() || "Tu Marca"}
              </h2>
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
                  className={`flex flex-col gap-3 rounded-2xl border p-5 ${fontAdvice.isGood ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20' : 'border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20'}`}
                >
                  <div className="flex items-center gap-2">
                    {fontAdvice.isGood ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    )}
                    <h3 className={`font-semibold ${fontAdvice.isGood ? 'text-emerald-900 dark:text-emerald-300' : 'text-amber-900 dark:text-amber-300'}`}>
                      Evaluación Tipográfica
                    </h3>
                  </div>
                  <div className={`text-sm leading-relaxed ${fontAdvice.isGood ? 'text-emerald-800 dark:text-emerald-200/80' : 'text-amber-800 dark:text-amber-200/80'}`}>
                    {fontAdvice.advice.split('\n').map((paragraph, idx) => (
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

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowRight, ArrowLeft, Palette, CheckCircle2,
  Laptop, Utensils, Leaf, Gem, BookOpen,
  Zap, ShieldCheck, Rocket, Crown, Users,
  Sun, Snowflake, Wand2, Moon
} from "lucide-react"
import { useRouter } from "next/navigation"

type Question = {
  id: string
  title: string
  subtitle: string
  options: { label: string; value: string; icon?: React.ReactNode }[]
}

const QUESTIONS: Question[] = [
  {
    id: "industry",
    title: "¿En qué rubro se encuentra tu negocio?",
    subtitle: "Esto nos ayuda a entender los estándares visuales de tu mercado.",
    options: [
      { label: "Tecnología / Software", value: "tech", icon: <Laptop className="w-5 h-5 text-blue-500" /> },
      { label: "Comida / Restaurante", value: "food", icon: <Utensils className="w-5 h-5 text-orange-500" /> },
      { label: "Salud / Bienestar", value: "health", icon: <Leaf className="w-5 h-5 text-green-500" /> },
      { label: "Lujo / Moda", value: "luxury", icon: <Gem className="w-5 h-5 text-purple-500" /> },
      { label: "Educación / Consultoría", value: "education", icon: <BookOpen className="w-5 h-5 text-indigo-500" /> },
    ],
  },
  {
    id: "personality",
    title: "¿Qué personalidad define mejor a tu marca?",
    subtitle: "El color transmite emociones antes de que el cliente lea una palabra.",
    options: [
      { label: "Enérgica y Pasional", value: "energetic", icon: <Zap className="w-5 h-5 text-red-500" /> },
      { label: "Confiable y Segura", value: "trustworthy", icon: <ShieldCheck className="w-5 h-5 text-slate-500" /> },
      { label: "Innovadora y Moderna", value: "innovative", icon: <Rocket className="w-5 h-5 text-cyan-500" /> },
      { label: "Elegante y Sofisticada", value: "elegant", icon: <Crown className="w-5 h-5 text-amber-500" /> },
      { label: "Cercana y Amigable", value: "friendly", icon: <Users className="w-5 h-5 text-emerald-500" /> },
    ],
  },
  {
    id: "preference",
    title: "¿Qué tipo de colores te atraen más?",
    subtitle: "Tu gusto personal también es importante para la identidad.",
    options: [
      { label: "Tonos Cálidos (Rojos, Naranjas, Amarillos)", value: "warm", icon: <Sun className="w-5 h-5 text-amber-500" /> },
      { label: "Tonos Fríos (Azules, Verdes, Morados)", value: "cool", icon: <Snowflake className="w-5 h-5 text-blue-400" /> },
      { label: "Colores Vibrantes y Llamativos", value: "vibrant", icon: <Wand2 className="w-5 h-5 text-fuchsia-500" /> },
      { label: "Colores Oscuros y Serios", value: "dark", icon: <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" /> },
    ],
  },
]

export default function GuidedModePage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isCalculating, setIsCalculating] = useState(false)
  const router = useRouter()

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: value })
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const finishWizard = () => {
    setIsCalculating(true)

    // Algoritmo de decisión basado en respuestas
    let h = 210 // Default Azul (Trust)
    let s = 70
    let l = 50
    let scheme = "analogous"

    // 1. Industry (Base Hue)
    switch (answers.industry) {
      case "tech": h = 210; break // Azul
      case "food": h = 15; break // Naranja/Rojo
      case "health": h = 145; break // Verde
      case "luxury": h = 45; break // Dorado
      case "education": h = 200; break // Azul claro
    }

    // 2. Personality (Scheme & Saturation)
    switch (answers.personality) {
      case "energetic": scheme = "complementary"; s = 90; break
      case "trustworthy": scheme = "analogous"; s = 60; break
      case "innovative": scheme = "triad"; s = 80; break
      case "elegant": scheme = "mono"; s = 30; break
      case "friendly": scheme = "analogous"; s = 75; break
    }

    // 3. Preference (Lightness & Hue Overrides)
    switch (answers.preference) {
      case "warm":
        if (h > 180 && h < 300) h = (h + 180) % 360 // Forzar cálido
        break
      case "cool":
        if (h < 90 || h > 300) h = 210 // Forzar azul frío
        break
      case "vibrant":
        s = 100
        l = 55
        break
      case "dark":
        s = Math.max(s - 20, 20)
        l = 25
        break
    }

    const hexBase = hslToHex(h, s, l).replace("#", "")

    setTimeout(() => {
      router.push(`/herramienta?profile=entrepreneur&color=${hexBase}&scheme=${scheme}`)
    }, 1500)
  }

  const currentQ = QUESTIONS[step]
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl relative">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={() => router.push("/")}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <span className="text-sm font-medium text-slate-500 absolute left-1/2 -translate-x-1/2">
              Paso {step + 1} de {QUESTIONS.length}
            </span>
            <button 
              onClick={() => router.push("/herramienta?profile=entrepreneur")}
              className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              Saltar <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: `${(step / QUESTIONS.length) * 100}%` }}
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {isCalculating ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative size-24 mb-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-blue-500 dark:border-t-blue-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Palette className="w-8 h-8 text-blue-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Generando Identidad Visual...</h2>
            <p className="text-slate-500 dark:text-slate-400">Analizando rubro, psicología y estética.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                  {currentQ.title}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {currentQ.subtitle}
                </p>
              </div>

              <div className="grid gap-4">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.value
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`relative flex items-center p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        isSelected 
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-md scale-[1.02]" 
                          : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-300 dark:hover:border-white/20 hover:scale-[1.01]"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl mr-4 transition-colors ${isSelected ? "bg-blue-100 dark:bg-blue-500/20" : "bg-slate-100 dark:bg-white/10"}`}>
                        {opt.icon}
                      </div>
                      <span className={`text-lg font-medium ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-200"}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-blue-500 ml-auto" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-12 flex justify-between items-center">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    step === 0 
                      ? "text-slate-300 dark:text-slate-700 cursor-not-allowed" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>

                {step === QUESTIONS.length - 1 ? (
                  <button
                    onClick={finishWizard}
                    disabled={!answers[currentQ.id]}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                  >
                    Generar Paleta <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!answers[currentQ.id]}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 dark:bg-white dark:text-black dark:hover:bg-slate-200 dark:disabled:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
                  >
                    Siguiente <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100
  const lN = l / 100
  const c = (1 - Math.abs(2 * lN - 1)) * sN
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lN - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

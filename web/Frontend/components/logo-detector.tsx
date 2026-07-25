"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Loader2, Sparkles, Image as ImageIcon } from "lucide-react"
import { detectLogoType } from "@/app/actions/gemini"

export function LogoDetector() {
  const [isOpen, setIsOpen] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<{ type: string; explanation: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result as string
      setImage(base64)
      analyzeImage(base64)
    }
    reader.readAsDataURL(file)
  }

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const res = await detectLogoType(base64Image)
      if (res.success) {
        setResult({ type: res.type!, explanation: res.explanation! })
      } else {
        setError(res.error || "Error desconocido al analizar la imagen.")
      }
    } catch (err: any) {
      setError(err.message || "Error de conexión al analizar la imagen.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setImage(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
        <Sparkles className="h-5 w-5" />
        IA: Detectar mi logo
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-5 md:p-6 shadow-2xl dark:bg-slate-900"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 text-center">
                <h3 className="flex justify-center items-center gap-2 text-2xl font-bold">
                  <Sparkles className="h-6 w-6 text-indigo-500" />
                  Detector de Logos IA
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Sube tu logo y nuestra IA te dirá si es un Isotipo, Logotipo, Imagotipo o Isologo.
                </p>
              </div>

              {!image ? (
                <div 
                  className="group flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-400 dark:hover:bg-indigo-900/20"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mb-2 h-7 w-7 text-slate-400 group-hover:text-indigo-500" />
                  <span className="font-medium text-sm text-slate-600 dark:text-slate-300">Haz clic para subir un logo</span>
                  <span className="mt-1 text-xs text-slate-500">PNG, JPG (max 5MB)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Logo subido" className="max-h-full max-w-full object-contain p-3" />
                    
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                        <span className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">Analizando...</span>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="w-full rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full rounded-2xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/10"
                    >
                      <h4 className="flex items-center gap-2 text-lg font-bold text-indigo-900 dark:text-indigo-100">
                        <ImageIcon className="h-5 w-5 text-indigo-500" />
                        Es un {result.type}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-indigo-800/80 dark:text-indigo-200/80">
                        {result.explanation}
                      </p>
                    </motion.div>
                  )}

                  {!isAnalyzing && (
                    <button
                      onClick={reset}
                      className="text-sm font-medium text-slate-500 hover:text-slate-900 underline-offset-4 hover:underline dark:text-slate-400 dark:hover:text-white"
                    >
                      Probar con otro logo
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

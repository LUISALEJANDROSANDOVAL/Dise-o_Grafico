"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useMotionValue } from "framer-motion"
import { X, ScanLine, Maximize } from "lucide-react"

interface ImagePickerModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  onColorExtracted: (hex: string) => void
}

export function ImagePickerModal({ isOpen, onClose, imageSrc, onColorExtracted }: ImagePickerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  const [mounted, setMounted] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar imagen en el canvas oculto para lectura de píxeles
  useEffect(() => {
    if (isOpen && imageSrc && canvasRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true })
        if (ctx && canvasRef.current) {
          canvasRef.current.width = img.width
          canvasRef.current.height = img.height
          ctx.drawImage(img, 0, 0, img.width, img.height)
        }
      }
      img.src = imageSrc
    }
  }, [isOpen, imageSrc])

  const handleScan = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return

    setIsScanning(true)

    setTimeout(() => {
      // 1. Obtener coordenadas del centro exacto de la pantalla (la mira)
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2

      // 2. Obtener la caja delimitadora (rectángulo) actual de la imagen arrastrada
      const rect = imageRef.current!.getBoundingClientRect()

      // 3. Calcular la coordenada de la mira relativa a la esquina superior izquierda de la imagen
      const pixelX = cx - rect.left
      const pixelY = cy - rect.top

      // 4. Si la mira está fuera de la imagen (el usuario arrastró demasiado lejos)
      if (pixelX < 0 || pixelY < 0 || pixelX > rect.width || pixelY > rect.height) {
        setIsScanning(false)
        alert("¡Apunta el escáner dentro de la imagen!")
        return
      }

      // 5. Escalar a la resolución real original de la imagen
      const scaleX = canvasRef.current!.width / rect.width
      const scaleY = canvasRef.current!.height / rect.height

      const realX = Math.floor(pixelX * scaleX)
      const realY = Math.floor(pixelY * scaleY)

      // 6. Extraer color del canvas
      const ctx = canvasRef.current!.getContext("2d", { willReadFrequently: true })
      if (ctx) {
        const pixel = ctx.getImageData(realX, realY, 1, 1).data
        const r = pixel[0]
        const g = pixel[1]
        const b = pixel[2]
        
        const toHex = (v: number) => v.toString(16).padStart(2, "0")
        const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
        
        onColorExtracted(hex)
        onClose()
      }
      setIsScanning(false)
    }, 500) // Pequeño delay para la animación de escaneo
  }, [onColorExtracted, onClose])

  const modalContent = (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden touch-none">
          
          {/* Instrucciones Top */}
          <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
            <div className="pointer-events-auto">
              <h3 className="text-white text-xl font-bold flex items-center gap-2 drop-shadow-md">
                <Maximize className="w-5 h-5 text-blue-400" />
                Encuadra el color
              </h3>
              <p className="text-white/80 text-sm drop-shadow-md">Arrastra la imagen hacia el centro</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Canvas oculto */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Contenedor de la Imagen Arrastrable */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.img
              ref={imageRef}
              src={imageSrc}
              drag
              dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }} // Libertad amplia de arrastre
              dragElastic={0.2}
              dragMomentum={false}
              style={{ x, y }}
              alt="Extract color"
              className="max-w-[150vw] max-h-[150vh] object-contain select-none shadow-2xl"
              draggable={false}
            />
          </motion.div>

          {/* Overlay Oscuro con "Hueco" Central (Escáner) */}
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
            {/* Sombras laterales */}
            <div className="absolute inset-0 bg-black/50 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" 
                 style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, calc(50% - 140px) calc(50% - 140px), calc(50% - 140px) calc(50% + 140px), calc(50% + 140px) calc(50% + 140px), calc(50% + 140px) calc(50% - 140px), calc(50% - 140px) calc(50% - 140px))" }} 
            />

            {/* Marco de Encuadre */}
            <div className="relative size-[280px] border-2 border-white/20 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Esquinas (Viewfinder) */}
              <div className="absolute -top-1 -left-1 size-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 size-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 size-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 size-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

              {/* Crosshair (Mira central) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative size-4">
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-500/80 -translate-y-1/2" />
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-blue-500/80 -translate-x-1/2" />
                  <div className="absolute inset-0 rounded-full border border-blue-500/50 scale-150" />
                </div>
              </div>
              
              {/* Scan animation beam */}
              {isScanning && (
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] z-30"
                  initial={{ top: 0, opacity: 1 }}
                  animate={{ top: "100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              )}
            </div>
          </div>

          {/* Action Button Bottom */}
          <div className="absolute bottom-10 z-50 pointer-events-auto">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all active:scale-95 shadow-[0_10px_40px_rgba(37,99,235,0.5)] disabled:opacity-50"
            >
              <ScanLine className={`w-6 h-6 ${isScanning ? "animate-pulse" : ""}`} />
              {isScanning ? "Escaneando..." : "Escanear Color"}
            </button>
          </div>

        </div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  return createPortal(modalContent, document.body)
}

"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ScanLine, Maximize, Sparkles, LocateFixed } from "lucide-react"

interface ImagePickerModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  onColorsExtracted: (hexes: string[]) => void
}

function extractDominantColors(canvas: HTMLCanvasElement, k: number = 5): string[] {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return []
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  
  const pixels: number[][] = []
  // Downsample to max ~3000 pixels for fast K-Means
  const step = Math.max(4, Math.floor((data.length / 4) / 3000) * 4) 
  for(let i=0; i<data.length; i+=step) {
    if(data[i+3] > 128) { // Ignore transparent pixels
      pixels.push([data[i], data[i+1], data[i+2]])
    }
  }
  
  if (pixels.length === 0) return []
  if (pixels.length < k) {
    k = pixels.length
  }

  // Initialize centroids (pick k random pixels)
  const centroids: number[][] = []
  for(let i=0; i<k; i++) {
     centroids.push(pixels[Math.floor(Math.random() * pixels.length)])
  }

  let clusters: number[][][] = []
  for(let iter=0; iter<10; iter++) {
    clusters = Array.from({length: k}, () => [])
    for(let i = 0; i < pixels.length; i++) {
       const p = pixels[i]
       let minDist = Infinity
       let closest = 0
       for(let j=0; j<k; j++) {
          const d = (p[0]-centroids[j][0])**2 + (p[1]-centroids[j][1])**2 + (p[2]-centroids[j][2])**2
          if(d < minDist) { minDist = d; closest = j }
       }
       clusters[closest].push(p)
    }
    let moved = false
    for(let i=0; i<k; i++) {
       if(clusters[i].length === 0) continue
       let sum = [0,0,0]
       for(let j=0; j<clusters[i].length; j++) { 
         sum[0]+=clusters[i][j][0]
         sum[1]+=clusters[i][j][1]
         sum[2]+=clusters[i][j][2]
       }
       const newC = [sum[0]/clusters[i].length, sum[1]/clusters[i].length, sum[2]/clusters[i].length]
       if(Math.abs(newC[0]-centroids[i][0])>1 || Math.abs(newC[1]-centroids[i][1])>1 || Math.abs(newC[2]-centroids[i][2])>1) moved = true
       centroids[i] = newC
    }
    if(!moved) break
  }

  return centroids.map((c, i) => ({ c, size: clusters[i].length }))
                  .sort((a,b) => b.size - a.size)
                  .map(item => {
                     // Find closest actual pixel to avoid muddy mathematical averages
                     let closestPixel = item.c
                     let minDist = Infinity
                     for(const p of pixels) {
                        const d = (p[0]-item.c[0])**2 + (p[1]-item.c[1])**2 + (p[2]-item.c[2])**2
                        if(d < minDist) { minDist = d; closestPixel = p }
                     }
                     const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")
                     return `#${toHex(closestPixel[0])}${toHex(closestPixel[1])}${toHex(closestPixel[2])}`
                  })
}


export function ImagePickerModal({ isOpen, onClose, imageSrc, onColorsExtracted }: ImagePickerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<"auto" | "manual">("auto")
  const [mounted, setMounted] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannerSize, setScannerSize] = useState(280)
  
  // Manual mode state
  const [previewColor, setPreviewColor] = useState<string | null>(null)
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 })
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 0, h: 0 })
  const [imgDisplaySize, setImgDisplaySize] = useState({ w: 0, h: 0 })
  const dragStart = useRef<{ x: number; y: number; ix: number; iy: number } | null>(null)
  const resizeStart = useRef<{ size: number; x: number; y: number } | null>(null)

  // Auto mode state
  const [autoPalette, setAutoPalette] = useState<string[]>([])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isOpen) {
      setImgPos({ x: 0, y: 0 })
      setScannerSize(280)
      setPreviewColor(null)
      setIsScanning(false)
      setAutoPalette([])
    }
  }, [isOpen, mode])

  // Load image and setup canvas
  useEffect(() => {
    if (isOpen && imageSrc && canvasRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        if (!canvasRef.current) return
        
        // Save full resolution for precision scanner
        canvasRef.current.width = img.naturalWidth
        canvasRef.current.height = img.naturalHeight
        const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true })
        if (ctx) ctx.drawImage(img, 0, 0)

        setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })

        const vw = window.innerWidth
        const vh = window.innerHeight
        const maxW = vw * 0.95
        const maxH = vh * 0.75
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1.5)
        setImgDisplaySize({ w: img.naturalWidth * scale, h: img.naturalHeight * scale })

        // Pre-calculate K-means if in auto mode
        if (mode === "auto") {
           // We scale down heavily for K-Means performance
           const kCanvas = document.createElement("canvas")
           const scaleK = Math.min(300 / img.naturalWidth, 300 / img.naturalHeight, 1)
           kCanvas.width = img.naturalWidth * scaleK
           kCanvas.height = img.naturalHeight * scaleK
           const kCtx = kCanvas.getContext("2d", { willReadFrequently: true })
           if (kCtx) {
             kCtx.drawImage(img, 0, 0, kCanvas.width, kCanvas.height)
             const colors = extractDominantColors(kCanvas, 5)
             setAutoPalette(colors)
           }
        }
      }
      img.src = imageSrc
    }
  }, [isOpen, imageSrc, mode])

  // --- Image Drag Handlers (Manual Mode) ---
  const onImgPointerDown = useCallback((e: React.PointerEvent) => {
    if (mode !== "manual") return
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX, y: e.clientY, ix: imgPos.x, iy: imgPos.y }
  }, [imgPos, mode])

  const onImgPointerMove = useCallback((e: React.PointerEvent) => {
    if (mode !== "manual" || !dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setImgPos({ x: dragStart.current.ix + dx, y: dragStart.current.iy + dy })
  }, [mode])

  const onImgPointerUp = useCallback(() => { dragStart.current = null }, [])

  // --- Corner Resize Handlers ---
  const onResizePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    resizeStart.current = { size: scannerSize, x: e.clientX, y: e.clientY }
  }, [scannerSize])

  const onResizePointerMove = useCallback((e: React.PointerEvent) => {
    if (!resizeStart.current) return
    const dx = e.clientX - resizeStart.current.x
    const dy = e.clientY - resizeStart.current.y
    const delta = Math.max(dx, dy)
    const newSize = Math.max(100, Math.min(600, resizeStart.current.size + delta * 2))
    setScannerSize(newSize)
  }, [])

  const onResizePointerUp = useCallback(() => { resizeStart.current = null }, [])

  // --- Read pixel at center (Manual Mode) ---
  const readCenterPixel = useCallback((): string | null => {
    if (!canvasRef.current || imgDisplaySize.w === 0 || mode !== "manual") return null

    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const imgScreenLeft = (window.innerWidth - imgDisplaySize.w) / 2 + imgPos.x
    const imgScreenTop = (window.innerHeight - imgDisplaySize.h) / 2 + imgPos.y

    const relX = cx - imgScreenLeft
    const relY = cy - imgScreenTop

    if (relX < 0 || relY < 0 || relX > imgDisplaySize.w || relY > imgDisplaySize.h) return null

    const scaleX = imgNaturalSize.w / imgDisplaySize.w
    const scaleY = imgNaturalSize.h / imgDisplaySize.h
    const canvasX = Math.floor(relX * scaleX)
    const canvasY = Math.floor(relY * scaleY)

    const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true })
    if (!ctx) return null

    let rTotal = 0, gTotal = 0, bTotal = 0, count = 0
    for (let sy = -1; sy <= 1; sy++) {
      for (let sx = -1; sx <= 1; sx++) {
        const px = Math.max(0, Math.min(imgNaturalSize.w - 1, canvasX + sx))
        const py = Math.max(0, Math.min(imgNaturalSize.h - 1, canvasY + sy))
        const pixel = ctx.getImageData(px, py, 1, 1).data
        rTotal += pixel[0]; gTotal += pixel[1]; bTotal += pixel[2]
        count++
      }
    }
    const toHex = (v: number) => Math.round(v / count).toString(16).padStart(2, "0")
    return `#${toHex(rTotal)}${toHex(gTotal)}${toHex(bTotal)}`
  }, [imgPos, imgDisplaySize, imgNaturalSize, mode])

  useEffect(() => {
    if (!isOpen || mode !== "manual") return
    setPreviewColor(readCenterPixel())
  }, [isOpen, imgPos, readCenterPixel, mode])

  const handleScan = useCallback(() => {
    setIsScanning(true)
    setTimeout(() => {
      if (mode === "auto") {
        if (autoPalette.length > 0) {
          onColorsExtracted(autoPalette)
          onClose()
        }
      } else {
        const hex = readCenterPixel()
        if (hex) {
          onColorsExtracted([hex])
          onClose()
        } else {
          alert("¡Apunta el escáner dentro de la imagen!")
        }
      }
      setIsScanning(false)
    }, 500)
  }, [mode, autoPalette, readCenterPixel, onColorsExtracted, onClose])

  const half = scannerSize / 2

  const modalContent = (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <div ref={containerRef} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden touch-none select-none">

          {/* Header & Mode Toggle */}
          <div className="absolute top-0 left-0 w-full p-6 z-50 flex flex-col sm:flex-row justify-between items-center pointer-events-none gap-4">
            <div className="pointer-events-auto">
              <h3 className="text-white text-xl font-bold flex items-center gap-2 drop-shadow-md">
                <Maximize className="w-5 h-5 text-blue-400" />
                Extraer Colores
              </h3>
            </div>
            
            <div className="pointer-events-auto flex items-center bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button 
                onClick={() => setMode("auto")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${mode === "auto" ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
              >
                <Sparkles className="w-4 h-4" /> Automático (IA)
              </button>
              <button 
                onClick={() => setMode("manual")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${mode === "manual" ? "bg-white text-black" : "text-white/70 hover:text-white"}`}
              >
                <LocateFixed className="w-4 h-4" /> Precisión (1)
              </button>
            </div>

            <button onClick={onClose} className="hidden sm:block p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto">
              <X className="w-6 h-6" />
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Draggable Image */}
          {imgDisplaySize.w > 0 && (
            <motion.img
              src={imageSrc}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`absolute shadow-2xl ${mode === "manual" ? "cursor-grab active:cursor-grabbing" : ""}`}
              style={{
                width: imgDisplaySize.w,
                height: imgDisplaySize.h,
                left: mode === "manual" ? `calc(50% - ${imgDisplaySize.w / 2}px + ${imgPos.x}px)` : "50%",
                top: mode === "manual" ? `calc(50% - ${imgDisplaySize.h / 2}px + ${imgPos.y}px)` : "45%", // shift slightly up in auto mode to make room for palette
                transform: mode === "auto" ? "translate(-50%, -50%)" : "none"
              }}
              onPointerDown={onImgPointerDown}
              onPointerMove={onImgPointerMove}
              onPointerUp={onImgPointerUp}
              onPointerCancel={onImgPointerUp}
              draggable={false}
              alt="Extraer color"
            />
          )}

          {/* Manual Mode Overlay & Scanner */}
          {mode === "manual" && (
            <>
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute bg-black/50" style={{ top: 0, left: 0, right: 0, height: `calc(50% - ${half}px)` }} />
                <div className="absolute bg-black/50" style={{ bottom: 0, left: 0, right: 0, height: `calc(50% - ${half}px)` }} />
                <div className="absolute bg-black/50" style={{ top: `calc(50% - ${half}px)`, left: 0, width: `calc(50% - ${half}px)`, height: scannerSize }} />
                <div className="absolute bg-black/50" style={{ top: `calc(50% - ${half}px)`, right: 0, width: `calc(50% - ${half}px)`, height: scannerSize }} />
              </div>

              <div className="absolute z-30 pointer-events-none" style={{ width: scannerSize, height: scannerSize, left: `calc(50% - ${half}px)`, top: `calc(50% - ${half}px)` }}>
                <div className="absolute inset-0 border-2 border-white/30 rounded-xl" />
                <div className="absolute -top-[3px] -left-[3px] size-8 border-t-[5px] border-l-[5px] border-blue-500 rounded-tl-xl" />
                <div className="absolute -top-[3px] -right-[3px] size-8 border-t-[5px] border-r-[5px] border-blue-500 rounded-tr-xl" />
                <div className="absolute -bottom-[3px] -left-[3px] size-8 border-b-[5px] border-l-[5px] border-blue-500 rounded-bl-xl" />
                <div className="absolute -bottom-[3px] -right-[3px] size-8 border-b-[5px] border-r-[5px] border-blue-500 rounded-br-xl" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative size-6">
                    <div className="absolute inset-x-0 top-1/2 h-[1.5px] bg-blue-400/90 -translate-y-1/2" />
                    <div className="absolute inset-y-0 left-1/2 w-[1.5px] bg-blue-400/90 -translate-x-1/2" />
                    <div className="absolute inset-0 rounded-full border-[1.5px] border-blue-400/60 scale-[1.8]" />
                  </div>
                </div>

                {previewColor && (
                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <div className="size-5 rounded-full border-2 border-white/50 shadow-md" style={{ backgroundColor: previewColor }} />
                    <span className="text-white font-mono text-sm">{previewColor.toUpperCase()}</span>
                  </div>
                )}

                {isScanning && (
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] z-30 rounded-full"
                    initial={{ top: 0, opacity: 1 }}
                    animate={{ top: "100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                )}

                <div
                  className="absolute -bottom-4 -right-4 size-10 z-50 pointer-events-auto cursor-nwse-resize flex items-center justify-center"
                  onPointerDown={onResizePointerDown}
                  onPointerMove={onResizePointerMove}
                  onPointerUp={onResizePointerUp}
                  onPointerCancel={onResizePointerUp}
                >
                  <div className="size-4 rounded-sm bg-blue-500 border-2 border-white shadow-lg" />
                </div>
              </div>
            </>
          )}

          {/* Auto Mode Palette Preview */}
          {mode === "auto" && autoPalette.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-32 z-50 pointer-events-auto flex gap-2 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
            >
              {autoPalette.map((hex, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/50 shadow-inner" style={{ backgroundColor: hex }} />
                  <span className="text-white/80 font-mono text-xs">{hex.toUpperCase()}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Scan Button */}
          <div className="absolute bottom-10 z-50 pointer-events-auto">
            <button
              onClick={handleScan}
              disabled={isScanning || (mode === "manual" && !previewColor) || (mode === "auto" && autoPalette.length === 0)}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all active:scale-95 shadow-[0_10px_40px_rgba(37,99,235,0.5)] disabled:opacity-60 disabled:shadow-none"
            >
              <ScanLine className={`w-6 h-6 ${isScanning ? "animate-pulse" : ""}`} />
              {isScanning ? "Procesando..." : mode === "auto" ? "Extraer 5 Colores" : "Extraer 1 Color"}
            </button>
          </div>

        </div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}

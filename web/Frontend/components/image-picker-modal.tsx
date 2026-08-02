"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ScanLine, Sparkles, LocateFixed } from "lucide-react"

interface ImagePickerModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  onColorsExtracted: (hexes: string[]) => void
}

/* ─── K-Means Clustering ────────────────────────────────── */
function extractDominantColors(canvas: HTMLCanvasElement, k: number = 5): string[] {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) return []
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data

  const pixels: number[][] = []
  const step = Math.max(4, Math.floor((data.length / 4) / 3000) * 4)
  for (let i = 0; i < data.length; i += step) {
    if (data[i + 3] > 128) pixels.push([data[i], data[i + 1], data[i + 2]])
  }

  if (pixels.length === 0) return []
  if (pixels.length < k) k = pixels.length

  // K-Means++ initialization for better spread
  const centroids: number[][] = [pixels[Math.floor(Math.random() * pixels.length)]]
  for (let c = 1; c < k; c++) {
    const dists = pixels.map(p => {
      let minD = Infinity
      for (const cent of centroids) {
        const d = (p[0] - cent[0]) ** 2 + (p[1] - cent[1]) ** 2 + (p[2] - cent[2]) ** 2
        if (d < minD) minD = d
      }
      return minD
    })
    const total = dists.reduce((a, b) => a + b, 0)
    let r = Math.random() * total
    for (let i = 0; i < dists.length; i++) {
      r -= dists[i]
      if (r <= 0) { centroids.push(pixels[i]); break }
    }
    if (centroids.length === c) centroids.push(pixels[Math.floor(Math.random() * pixels.length)])
  }

  let clusters: number[][][] = []
  for (let iter = 0; iter < 15; iter++) {
    clusters = Array.from({ length: k }, () => [])
    for (const p of pixels) {
      let minDist = Infinity, closest = 0
      for (let j = 0; j < k; j++) {
        const d = (p[0] - centroids[j][0]) ** 2 + (p[1] - centroids[j][1]) ** 2 + (p[2] - centroids[j][2]) ** 2
        if (d < minDist) { minDist = d; closest = j }
      }
      clusters[closest].push(p)
    }
    let moved = false
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue
      const sum = [0, 0, 0]
      for (const p of clusters[i]) { sum[0] += p[0]; sum[1] += p[1]; sum[2] += p[2] }
      const newC = [sum[0] / clusters[i].length, sum[1] / clusters[i].length, sum[2] / clusters[i].length]
      if (Math.abs(newC[0] - centroids[i][0]) > 1 || Math.abs(newC[1] - centroids[i][1]) > 1 || Math.abs(newC[2] - centroids[i][2]) > 1) moved = true
      centroids[i] = newC
    }
    if (!moved) break
  }

  const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")
  return centroids
    .map((c, i) => ({ c, size: clusters[i]?.length ?? 0 }))
    .filter(item => item.size > 0)
    .sort((a, b) => b.size - a.size)
    .map(item => `#${toHex(item.c[0])}${toHex(item.c[1])}${toHex(item.c[2])}`)
}

/* ─── Modal Component ───────────────────────────────────── */
export function ImagePickerModal({ isOpen, onClose, imageSrc, onColorsExtracted }: ImagePickerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImgPos({ x: 0, y: 0 })
      setScannerSize(280)
      setPreviewColor(null)
      setIsScanning(false)
      setAutoPalette([])
      setIsAnalyzing(false)
      setImgDisplaySize({ w: 0, h: 0 })
    }
  }, [isOpen])

  // Load image into canvas + run K-Means for auto mode
  useEffect(() => {
    if (!isOpen || !imageSrc) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // Draw full-res into hidden canvas for manual pixel picking
      if (canvasRef.current) {
        canvasRef.current.width = img.naturalWidth
        canvasRef.current.height = img.naturalHeight
        const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true })
        if (ctx) ctx.drawImage(img, 0, 0)
      }

      setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })

      // Calculate display size
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxW = vw * 0.9
      const maxH = vh * 0.6
      const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1.5)
      setImgDisplaySize({ w: img.naturalWidth * scale, h: img.naturalHeight * scale })

      // Always pre-calculate K-Means (so switching to auto mode is instant)
      setIsAnalyzing(true)
      requestAnimationFrame(() => {
        const kCanvas = document.createElement("canvas")
        const scaleK = Math.min(200 / img.naturalWidth, 200 / img.naturalHeight, 1)
        kCanvas.width = Math.max(1, Math.floor(img.naturalWidth * scaleK))
        kCanvas.height = Math.max(1, Math.floor(img.naturalHeight * scaleK))
        const kCtx = kCanvas.getContext("2d", { willReadFrequently: true })
        if (kCtx) {
          kCtx.drawImage(img, 0, 0, kCanvas.width, kCanvas.height)
          const colors = extractDominantColors(kCanvas, 5)
          setAutoPalette(colors)
        }
        setIsAnalyzing(false)
      })
    }
    img.src = imageSrc
  }, [isOpen, imageSrc])

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

  // Keep latest refs to avoid stale closures in setTimeout
  const onCloseRef = useRef(onClose)
  const onColorsExtractedRef = useRef(onColorsExtracted)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])
  useEffect(() => { onColorsExtractedRef.current = onColorsExtracted }, [onColorsExtracted])

  const handleExtract = useCallback(() => {
    try {
      if (mode === "auto" && autoPalette.length > 0) {
        console.log("Extracting auto palette:", autoPalette);
        onColorsExtractedRef.current(autoPalette)
        console.log("Palette extracted, closing modal...");
        onCloseRef.current()
        return
      }

      if (mode === "manual") {
        const hex = readCenterPixel()
        if (hex) {
          onColorsExtractedRef.current([hex])
          onCloseRef.current()
        } else {
          alert("¡Apunta el escáner dentro de la imagen!")
        }
        return
      }
    } catch (e: any) {
      console.error("Error extracting colors:", e)
      alert("Error: " + e.message)
    }
  }, [mode, autoPalette, readCenterPixel])

  const half = scannerSize / 2

  const modalContent = (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden touch-none select-none"
        >
          {/* ─── Header & Mode Toggle ─── */}
          <div className="absolute top-0 left-0 w-full p-4 sm:p-6 z-50 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto">
              <h3 className="text-white text-lg font-bold flex items-center gap-2 drop-shadow-md">
                <ScanLine className="w-5 h-5 text-blue-400" />
                Extraer Colores
              </h3>
            </div>

            {/* Mode Switcher */}
            <div className="pointer-events-auto flex items-center bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button
                onClick={() => setMode("auto")}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all ${mode === "auto" ? "bg-white text-black shadow-md" : "text-white/70 hover:text-white"}`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto (5)
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium transition-all ${mode === "manual" ? "bg-white text-black shadow-md" : "text-white/70 hover:text-white"}`}
              >
                <LocateFixed className="w-3.5 h-3.5" /> Precisión (1)
              </button>
            </div>

            <button onClick={onClose} className="p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto">
              <X className="w-5 h-5" />
            </button>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* ─── Image ─── */}
          {imgDisplaySize.w > 0 && (
            <img
              src={imageSrc}
              className={`absolute rounded-lg shadow-2xl ${mode === "manual" ? "cursor-grab active:cursor-grabbing" : ""}`}
              style={{
                width: imgDisplaySize.w,
                height: imgDisplaySize.h,
                left: `calc(50% - ${imgDisplaySize.w / 2}px + ${mode === "manual" ? imgPos.x : 0}px)`,
                top: `calc(50% - ${imgDisplaySize.h / 2}px + ${mode === "manual" ? imgPos.y : 0}px - ${mode === "auto" ? 40 : 0}px)`,
              }}
              onPointerDown={onImgPointerDown}
              onPointerMove={onImgPointerMove}
              onPointerUp={onImgPointerUp}
              onPointerCancel={onImgPointerUp}
              draggable={false}
              alt="Extraer color"
            />
          )}

          {/* ─── Manual Mode: Scanner Overlay ─── */}
          {mode === "manual" && (
            <>
              {/* Dark mask (4 rectangles around the scanner hole) */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute bg-black/50" style={{ top: 0, left: 0, right: 0, height: `calc(50% - ${half}px)` }} />
                <div className="absolute bg-black/50" style={{ bottom: 0, left: 0, right: 0, height: `calc(50% - ${half}px)` }} />
                <div className="absolute bg-black/50" style={{ top: `calc(50% - ${half}px)`, left: 0, width: `calc(50% - ${half}px)`, height: scannerSize }} />
                <div className="absolute bg-black/50" style={{ top: `calc(50% - ${half}px)`, right: 0, width: `calc(50% - ${half}px)`, height: scannerSize }} />
              </div>

              {/* Scanner frame */}
              <div className="absolute z-30 pointer-events-none" style={{ width: scannerSize, height: scannerSize, left: `calc(50% - ${half}px)`, top: `calc(50% - ${half}px)` }}>
                <div className="absolute inset-0 border-2 border-white/30 rounded-xl" />
                <div className="absolute -top-[3px] -left-[3px] size-8 border-t-[5px] border-l-[5px] border-blue-500 rounded-tl-xl" />
                <div className="absolute -top-[3px] -right-[3px] size-8 border-t-[5px] border-r-[5px] border-blue-500 rounded-tr-xl" />
                <div className="absolute -bottom-[3px] -left-[3px] size-8 border-b-[5px] border-l-[5px] border-blue-500 rounded-bl-xl" />
                <div className="absolute -bottom-[3px] -right-[3px] size-8 border-b-[5px] border-r-[5px] border-blue-500 rounded-br-xl" />

                {/* Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative size-6">
                    <div className="absolute inset-x-0 top-1/2 h-[1.5px] bg-blue-400/90 -translate-y-1/2" />
                    <div className="absolute inset-y-0 left-1/2 w-[1.5px] bg-blue-400/90 -translate-x-1/2" />
                    <div className="absolute inset-0 rounded-full border-[1.5px] border-blue-400/60 scale-[1.8]" />
                  </div>
                </div>

                {/* Preview badge */}
                {previewColor && (
                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <div className="size-5 rounded-full border-2 border-white/50 shadow-md" style={{ backgroundColor: previewColor }} />
                    <span className="text-white font-mono text-sm">{previewColor.toUpperCase()}</span>
                  </div>
                )}

                {/* Scan animation */}
                {isScanning && (
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] z-30 rounded-full"
                    initial={{ top: 0, opacity: 1 }}
                    animate={{ top: "100%", opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  />
                )}

                {/* Resize handle */}
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

          {/* ─── Auto Mode: Palette Preview ─── */}
          {mode === "auto" && (
            <div className="absolute bottom-28 z-50 pointer-events-auto">
              {isAnalyzing ? (
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="size-5 border-2 border-white/30 border-t-blue-400 rounded-full"
                  />
                  <span className="text-white/80 text-sm font-medium">Analizando colores dominantes…</span>
                </div>
              ) : autoPalette.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
                >
                  {autoPalette.map((hex, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl border-2 border-white/40 shadow-lg"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-white/70 font-mono text-[10px]">{hex.toUpperCase()}</span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-white/50 text-sm">No se detectaron colores</div>
              )}
            </div>
          )}

          {/* ─── Extract Button ─── */}
          <div className="absolute bottom-8 z-50 pointer-events-auto">
            <button
              onClick={handleExtract}
              disabled={isScanning || isAnalyzing || (mode === "manual" && !previewColor) || (mode === "auto" && autoPalette.length === 0)}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-8 py-3.5 rounded-full font-bold text-base transition-all active:scale-95 shadow-[0_8px_30px_rgba(37,99,235,0.5)] disabled:opacity-50 disabled:shadow-none"
            >
              <ScanLine className={`w-5 h-5 ${isScanning ? "animate-pulse" : ""}`} />
              {isScanning
                ? "Procesando…"
                : mode === "auto"
                  ? "Extraer Paleta"
                  : "Extraer 1 Color"}
            </button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null
  return createPortal(modalContent, document.body)
}

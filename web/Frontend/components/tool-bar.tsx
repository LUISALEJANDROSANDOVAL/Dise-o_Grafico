"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Eye, FileDown, QrCode, Check, X, Save, Loader2, Code, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type ColorblindMode, CB_LABELS, type Swatch } from "@/lib/color"
import type { Profile } from "@/components/rulec-header"
import { downloadCSS, generateTailwindConfig, downloadASE } from "@/utils/export-formats"

const CB_MODES: ColorblindMode[] = ["none", "protanopia", "deuteranopia", "tritanopia"]

type Props = {
  colorblind: ColorblindMode
  onColorblindChange: (m: ColorblindMode) => void
  palette: Swatch[]
  onExport: () => void
  onSave?: () => void
  isSaving?: boolean
  profile: Profile
}

export function ToolBar({ colorblind, onColorblindChange, palette, onExport, onSave, isSaving, profile }: Props) {
  const [cbOpen, setCbOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [techExportOpen, setTechExportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedTailwind, setCopiedTailwind] = useState(false)
  const [qr, setQr] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?p=${palette.map((s) => s.hex.slice(1)).join("-")}`
      : ""

  useEffect(() => {
    if (!shareOpen || !shareUrl) return
    QRCode.toDataURL(shareUrl, { width: 220, margin: 1 })
      .then(setQr)
      .catch(() => setQr(null))
  }, [shareOpen, shareUrl])

  function copyLink() {
    navigator.clipboard?.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleCopyTailwind() {
    const config = generateTailwindConfig(palette)
    navigator.clipboard?.writeText(config)
    setCopiedTailwind(true)
    setTimeout(() => setCopiedTailwind(false), 1500)
  }

  return (
    <div className="sticky bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Colorblind simulation */}
        <div className="relative">
          <Button
            variant={colorblind === "none" ? "outline" : "default"}
            onClick={() => setCbOpen((o) => !o)}
            aria-expanded={cbOpen}
            aria-pressed={colorblind !== "none"}
            className={cn(colorblind !== "none" && "ring-2 ring-foreground/20 ring-offset-2 ring-offset-background")}
          >
            <Eye />
            <span className="hidden sm:inline">Daltonismo:</span> {CB_LABELS[colorblind]}
            {colorblind !== "none" && (
              <span className="ml-1 rounded-full bg-background/25 px-1.5 py-0.5 text-[10px] font-semibold">
                ON
              </span>
            )}
          </Button>
          {cbOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setCbOpen(false)} aria-hidden />
              <div className="absolute bottom-full left-0 z-20 mb-2 w-52 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg">
                {CB_MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                       onColorblindChange(m)
                      setCbOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
                      colorblind === m ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {CB_LABELS[m]}
                    {colorblind === m && <Check className="size-3.5" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Share */}
          <div className="relative">
            <Button variant="outline" onClick={() => setShareOpen((o) => !o)} aria-expanded={shareOpen}>
              <QrCode />
              <span className="hidden sm:inline">Compartir QR / Link</span>
              <span className="sm:hidden">Compartir</span>
            </Button>
            {shareOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShareOpen(false)} aria-hidden />
                <div className="absolute bottom-full right-0 z-20 mb-2 w-64 rounded-lg border border-border bg-popover p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Compartir paleta</span>
                    <button onClick={() => setShareOpen(false)} aria-label="Cerrar">
                      <X className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                  {qr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qr || "/placeholder.svg"}
                      alt="Código QR de la paleta"
                      className="mx-auto mb-3 size-40 rounded-md border border-border"
                    />
                  ) : (
                    <div className="mx-auto mb-3 size-40 animate-pulse rounded-md bg-muted" />
                  )}
                  <Button variant="secondary" className="w-full" onClick={copyLink}>
                    {copied ? <Check /> : <QrCode />}
                    {copied ? "Enlace copiado" : "Copiar enlace"}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Technical Export Dropdown for Designer Profile */}
          {profile === "designer" && (
            <div className="relative">
              <Button variant="outline" onClick={() => setTechExportOpen((o) => !o)} aria-expanded={techExportOpen}>
                <Code className="text-blue-500" />
                <span className="hidden sm:inline">Exportar Técnico</span>
                <span className="sm:hidden">Formatos</span>
              </Button>
              {techExportOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setTechExportOpen(false)} aria-hidden />
                  <div className="absolute bottom-full right-0 z-20 mb-2 w-72 rounded-lg border border-border bg-popover p-4 shadow-lg">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">Exportación Técnica</span>
                      <button onClick={() => setTechExportOpen(false)} aria-label="Cerrar">
                        <X className="size-4 text-muted-foreground" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          downloadCSS(palette)
                          setTechExportOpen(false)
                        }}
                      >
                        <Download className="size-3.5 text-blue-500" />
                        Descargar Variables CSS (.css)
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          downloadASE(palette)
                          setTechExportOpen(false)
                        }}
                      >
                        <Download className="size-3.5 text-emerald-500" />
                        Descargar Muestras Adobe (.ase)
                      </Button>

                      <div className="mt-2 border-t border-border pt-2">
                        <span className="block text-[11px] font-medium text-muted-foreground mb-1">
                          Configuración Tailwind CSS
                        </span>
                        <div className="relative rounded bg-muted p-2 font-mono text-[9px] text-muted-foreground max-h-24 overflow-y-auto">
                          <pre>{generateTailwindConfig(palette)}</pre>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          className="mt-2 w-full gap-2 text-xs"
                          onClick={handleCopyTailwind}
                        >
                          {copiedTailwind ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                          {copiedTailwind ? "Configuración Copiada" : "Copiar Config Tailwind"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Save Palette */}
          {onSave && (
            <Button onClick={onSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
              <span className="hidden sm:inline">Guardar Paleta</span>
              <span className="sm:hidden">Guardar</span>
            </Button>
          )}

          {/* Export */}
          <Button onClick={onExport} variant="secondary">
            <FileDown />
            <span className="hidden sm:inline">Exportar PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}


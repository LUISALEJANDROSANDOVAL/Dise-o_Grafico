import { type Swatch, hexToRgb } from "./color"
import { generateASE } from "./ase"
import { jsPDF } from "jspdf"

// ── CSS Export ───────────────────────────────────────────────────────────
export function exportToCSS(palette: Swatch[]) {
  let css = ":root {\n"
  palette.forEach((swatch, index) => {
    css += `  --color-${index + 1}: ${swatch.hex};\n`
  })
  css += "}\n"

  download(new Blob([css], { type: "text/css" }), "cromatic-palette.css")
}

// ── ASE Export ───────────────────────────────────────────────────────────
export function exportToASE(palette: Swatch[]) {
  download(generateASE(palette), "cromatic-palette.ase")
}

// ── PDF Export (pure jsPDF – no html2canvas) ─────────────────────────────
export async function exportToPDF(palette: Swatch[]) {
  try {
    const pdf = new jsPDF("p", "mm", "a4")
    const W = pdf.internal.pageSize.getWidth()   // 210 mm
    const H = pdf.internal.pageSize.getHeight()   // 297 mm
    const M = 20 // margin

    // ── Title ──────────────────────────────────────────────────────
    pdf.setFontSize(24)
    pdf.setTextColor(30, 30, 30)
    pdf.text("Kit Básico de Marca", M, M + 10)

    pdf.setFontSize(11)
    pdf.setTextColor(120, 120, 120)
    pdf.text("Generado con CROMATIC", M, M + 18)

    // Separator line
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.3)
    pdf.line(M, M + 23, W - M, M + 23)

    // ── Palette Swatches ───────────────────────────────────────────
    const swatchY = M + 32
    pdf.setFontSize(14)
    pdf.setTextColor(30, 30, 30)
    pdf.text("Paleta de Colores", M, swatchY)

    const count = palette.length
    const gap = 3
    const totalGaps = (count - 1) * gap
    const available = W - M * 2
    const swW = (available - totalGaps) / count
    const swH = 28

    palette.forEach((swatch, i) => {
      const x = M + i * (swW + gap)
      const y = swatchY + 5
      const { r, g, b } = hexToRgb(swatch.hex)

      // Filled rectangle
      pdf.setFillColor(r, g, b)
      pdf.roundedRect(x, y, swW, swH, 2, 2, "F")

      // HEX label below swatch
      pdf.setFontSize(8)
      pdf.setTextColor(60, 60, 60)
      pdf.text(swatch.hex, x + swW / 2, y + swH + 5, { align: "center" })
    })

    // ── Business Card Mockup ──────────────────────────────────────
    const cardY = swatchY + swH + 22
    pdf.setFontSize(14)
    pdf.setTextColor(30, 30, 30)
    pdf.text("Tarjeta de Presentación", M, cardY)

    const cardW = available
    const cardH = cardW / 1.75 // match the 1.75:1 aspect ratio from the UI
    const cy = cardY + 5

    // Card background (use the darkest color in the palette)
    const darkSwatch = palette[palette.length - 1] || palette[0]
    const darkRgb = hexToRgb(darkSwatch.hex)
    pdf.setFillColor(darkRgb.r, darkRgb.g, darkRgb.b)
    pdf.roundedRect(M, cy, cardW, cardH, 3, 3, "F")

    // Determine readable text color for the card
    const luminance = (darkRgb.r * 0.299 + darkRgb.g * 0.587 + darkRgb.b * 0.114) / 255
    const textR = luminance > 0.5 ? 20 : 240
    const textG = luminance > 0.5 ? 20 : 240
    const textB = luminance > 0.5 ? 20 : 240

    // Company name
    pdf.setFontSize(18)
    pdf.setTextColor(textR, textG, textB)
    pdf.text("Estudio Nova", M + 10, cy + 14)

    // Accent square (use accent color – palette[3] or fallback)
    const accentSwatch = palette[3] || palette[1] || palette[0]
    const accentRgb = hexToRgb(accentSwatch.hex)
    pdf.setFillColor(accentRgb.r, accentRgb.g, accentRgb.b)
    pdf.roundedRect(M + cardW - 18, cy + 6, 8, 8, 1, 1, "F")

    // Person info
    pdf.setFontSize(11)
    pdf.setTextColor(textR, textG, textB)
    pdf.text("Camila Rojas", M + 10, cy + cardH - 18)
    pdf.setFontSize(9)
    pdf.text("Directora creativa", M + 10, cy + cardH - 12)

    // Brand color bar
    const brandSwatch = palette[2] || palette[0]
    const brandRgb = hexToRgb(brandSwatch.hex)
    pdf.setFillColor(brandRgb.r, brandRgb.g, brandRgb.b)
    pdf.roundedRect(M + 10, cy + cardH - 7, 24, 2, 1, 1, "F")

    // ── Color Detail Table ────────────────────────────────────────
    const tableY = cy + cardH + 15
    pdf.setFontSize(14)
    pdf.setTextColor(30, 30, 30)
    pdf.text("Detalle de Colores", M, tableY)

    const rowH = 10
    const colW = available / 4

    // Table header
    pdf.setFillColor(240, 240, 240)
    pdf.rect(M, tableY + 4, available, rowH, "F")
    pdf.setFontSize(9)
    pdf.setTextColor(60, 60, 60)
    pdf.text("Color", M + 4, tableY + 11)
    pdf.text("HEX", M + colW, tableY + 11)
    pdf.text("RGB", M + colW * 2, tableY + 11)
    pdf.text("HSL", M + colW * 3, tableY + 11)

    // Table rows
    palette.forEach((swatch, i) => {
      const ry = tableY + 4 + rowH * (i + 1)
      const { r, g, b } = hexToRgb(swatch.hex)

      // Alternate row bg
      if (i % 2 === 0) {
        pdf.setFillColor(250, 250, 250)
        pdf.rect(M, ry, available, rowH, "F")
      }

      // Small color circle
      pdf.setFillColor(r, g, b)
      pdf.circle(M + 6, ry + rowH / 2, 3, "F")

      pdf.setFontSize(9)
      pdf.setTextColor(40, 40, 40)
      pdf.text(`Color ${i + 1}`, M + 12, ry + 7)
      pdf.text(swatch.hex, M + colW, ry + 7)
      pdf.text(`${r}, ${g}, ${b}`, M + colW * 2, ry + 7)
      pdf.text(`${swatch.h}°, ${swatch.s}%, ${swatch.l}%`, M + colW * 3, ry + 7)
    })

    // ── Footer ────────────────────────────────────────────────────
    pdf.setFontSize(8)
    pdf.setTextColor(170, 170, 170)
    pdf.text("cromatic.com", W / 2, H - 10, { align: "center" })

    pdf.save("cromatic-brand-kit.pdf")
  } catch (error: any) {
    console.error("Error exporting to PDF:", error)
    alert(`Hubo un error al generar el PDF: ${error.message || error}`)
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

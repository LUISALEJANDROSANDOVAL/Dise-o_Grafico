export type HSL = { h: number; s: number; l: number }
export type Swatch = { h: number; s: number; l: number; hex: string }
export type Scheme = "mono" | "analogous" | "complementary" | "triad"

export const SCHEMES: { id: Scheme; entrepreneur: string; designer: string; explanation: string }[] = [
  { 
    id: "mono", 
    entrepreneur: "Un solo color", 
    designer: "Monocromático",
    explanation: "El esquema monocromático utiliza un solo color base con variaciones de saturación y luminosidad. Funciona perfectamente porque crea un aspecto cohesivo, elegante y muy limpio sin el riesgo de choques visuales."
  },
  { 
    id: "analogous", 
    entrepreneur: "Colores vecinos", 
    designer: "Análogos",
    explanation: "Los colores análogos se encuentran uno al lado del otro en el círculo cromático. Funcionan juntos porque comparten matices subyacentes, creando diseños armoniosos, relajantes y naturales que son muy agradables a la vista."
  },
  { 
    id: "complementary", 
    entrepreneur: "Alto contraste", 
    designer: "Complementarios",
    explanation: "Los esquemas complementarios utilizan colores opuestos en el círculo cromático (ej. cálido vs. frío). Funcionan porque crean el máximo contraste visual, lo que hace que los elementos resalten instantáneamente y atraigan la atención."
  },
  { 
    id: "triad", 
    entrepreneur: "Tres tonos", 
    designer: "Tríada",
    explanation: "La tríada utiliza tres colores espaciados equitativamente en el círculo cromático. Funciona porque ofrece un alto contraste visual al tiempo que mantiene el equilibrio y la riqueza del color, ideal para marcas dinámicas y juveniles."
  },
]

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n))
}

export function hslToHex({ h, s, l }: HSL): string {
  const sN = s / 100
  const lN = l / 100
  const c = (1 - Math.abs(2 * lN - 1)) * sN
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lN - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "")
  const bigint = Number.parseInt(clean, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

export function rgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  return `${r}, ${g}, ${b}`
}

export function cmykString(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const rN = r / 255
  const gN = g / 255
  const bN = b / 255
  const k = 1 - Math.max(rN, gN, bN)
  if (k === 1) return "0, 0, 0, 100"
  const c = Math.round(((1 - rN - k) / (1 - k)) * 100)
  const m = Math.round(((1 - gN - k) / (1 - k)) * 100)
  const y = Math.round(((1 - bN - k) / (1 - k)) * 100)
  return `${c}, ${m}, ${y}, ${Math.round(k * 100)}`
}

export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex)
  const rN = r / 255
  const gN = g / 255
  const bN = b / 255
  const max = Math.max(rN, gN, bN)
  const min = Math.min(rN, gN, bN)
  let h = 0
  const l = (max + min) / 2
  const d = max - min
  let s = 0
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case rN:
        h = ((gN - bN) / d) % 6
        break
      case gN:
        h = (bN - rN) / d + 2
        break
      default:
        h = (rN - gN) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function make(h: number, s: number, l: number): Swatch {
  const hh = ((h % 360) + 360) % 360
  const hsl = { h: hh, s: clamp(s), l: clamp(l) }
  return { ...hsl, hex: hslToHex(hsl) }
}

export function generatePalette(base: HSL, scheme: Scheme): Swatch[] {
  const { h, s } = base
  switch (scheme) {
    case "mono":
      return [
        make(h, s, 92),
        make(h, s, 72),
        make(h, s, 52),
        make(h, s, 34),
        make(h, s, 18),
      ]
    case "analogous":
      return [
        make(h - 40, s, 55),
        make(h - 20, s, 50),
        make(h, s, 48),
        make(h + 20, s, 50),
        make(h + 40, s, 55),
      ]
    case "complementary":
      return [
        make(h, s, 45),
        make(h, s, 68),
        make(h, 12, 94),
        make(h + 180, s, 68),
        make(h + 180, s, 45),
      ]
    case "triad":
      return [
        make(h, s, 50),
        make(h + 120, s, 50),
        make(h + 240, s, 50),
        make(h, Math.max(10, s - 40), 88),
        make(h, s, 22),
      ]
  }
}

// Relative luminance per WCAG
function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const channel = (c: number) => {
    const cs = c / 255
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg)
  const l2 = luminance(bg)
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (light + 0.05) / (dark + 0.05)
}

export type ContrastLevel = { ratio: number; label: "AAA" | "AA" | "AA Large" | "Fail" }

export function contrastLevel(fg: string, bg: string): ContrastLevel {
  const ratio = Math.round(contrastRatio(fg, bg) * 100) / 100
  let label: ContrastLevel["label"] = "Fail"
  if (ratio >= 7) label = "AAA"
  else if (ratio >= 4.5) label = "AA"
  else if (ratio >= 3) label = "AA Large"
  return { ratio, label }
}

/** Pick black or white text for best contrast on a given background */
export function readableText(bg: string): "#FFFFFF" | "#111111" {
  return contrastRatio("#FFFFFF", bg) >= contrastRatio("#111111", bg) ? "#FFFFFF" : "#111111"
}

export type ColorblindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia"

const CB_MATRIX: Record<Exclude<ColorblindMode, "none">, number[]> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
}

export function simulate(hex: string, mode: ColorblindMode): string {
  if (mode === "none") return hex
  const { r, g, b } = hexToRgb(hex)
  const m = CB_MATRIX[mode]
  const nr = clampByte(r * m[0] + g * m[1] + b * m[2])
  const ng = clampByte(r * m[3] + g * m[4] + b * m[5])
  const nb = clampByte(r * m[6] + g * m[7] + b * m[8])
  const toHex = (v: number) => v.toString(16).padStart(2, "0")
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`.toUpperCase()
}

function clampByte(v: number) {
  return Math.min(255, Math.max(0, Math.round(v)))
}

export const CB_LABELS: Record<ColorblindMode, string> = {
  none: "Visión normal",
  protanopia: "Protanopía",
  deuteranopia: "Deuteranopía",
  tritanopia: "Tritanopía",
}

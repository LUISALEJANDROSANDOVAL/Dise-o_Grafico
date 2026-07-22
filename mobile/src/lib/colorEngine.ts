import chroma from 'chroma-js';

export type HarmonyType = 'complementary' | 'analogous' | 'triad' | 'split-complementary' | 'square' | 'tetradic' | 'monochrome';

export interface SwatchData {
  hex: string;
  label: string;
  rgb: string;
}

export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
}

/**
 * Calcula esquemas cromáticos automáticos basados en un color base (RF-07)
 */
export function generateHarmonies(baseHex: string, harmonyType: HarmonyType = 'complementary'): SwatchData[] {
  let color = chroma(baseHex);
  let mainHex = color.hex().toUpperCase();
  let mainRgb = `rgb(${color.rgb().join(', ')})`;

  let accentHex = '#0080FF';
  let secondaryHex = '#FF0080'; // New swatch for complex harmonies
  let paperBgHex = '#FAF6EF';
  let inkTextHex = '#241F1A';

  switch (harmonyType) {
    case 'complementary':
      accentHex = color.set('hsl.h', '+180').hex().toUpperCase();
      secondaryHex = color.set('hsl.h', '+180').brighten(1).hex().toUpperCase();
      break;
    case 'analogous':
      accentHex = color.set('hsl.h', '+30').hex().toUpperCase();
      secondaryHex = color.set('hsl.h', '-30').hex().toUpperCase();
      break;
    case 'triad':
      accentHex = color.set('hsl.h', '+120').hex().toUpperCase();
      secondaryHex = color.set('hsl.h', '+240').hex().toUpperCase();
      break;
    case 'split-complementary':
      accentHex = color.set('hsl.h', '+150').hex().toUpperCase();
      secondaryHex = color.set('hsl.h', '+210').hex().toUpperCase();
      break;
    case 'square':
      accentHex = color.set('hsl.h', '+90').hex().toUpperCase();
      secondaryHex = color.set('hsl.h', '+180').hex().toUpperCase();
      break;
    case 'tetradic':
      accentHex = color.set('hsl.h', '+60').hex().toUpperCase();
      secondaryHex = color.set('hsl.h', '+180').hex().toUpperCase();
      break;
    case 'monochrome':
      accentHex = color.brighten(1.2).hex().toUpperCase();
      secondaryHex = color.darken(1.2).hex().toUpperCase();
      break;
  }

  const accentColor = chroma(accentHex);
  const accentRgb = `rgb(${accentColor.rgb().join(', ')})`;
  const secondaryColor = chroma(secondaryHex);
  const secondaryRgb = `rgb(${secondaryColor.rgb().join(', ')})`;

  return [
    { hex: mainHex, label: 'Matiz Principal', rgb: mainRgb },
    { hex: accentHex, label: 'Acento Primario', rgb: accentRgb },
    { hex: secondaryHex, label: 'Acento Secundario', rgb: secondaryRgb },
    { hex: paperBgHex, label: 'Fondo (Papel)', rgb: 'rgb(250, 246, 239)' },
    { hex: inkTextHex, label: 'Texto (Tinta)', rgb: 'rgb(36, 31, 26)' },
  ];
}

/**
 * Convierte un color HEX a múltiples formatos técnicos HEX, RGB, HSL, CMYK (RF-10)
 */
export function convertColorFormats(hex: string): ColorFormats {
  const c = chroma(hex);
  const [r, g, b] = c.rgb();
  const [h, s, l] = c.hsl();

  // Cálculo CMYK aproximado
  const k = 1 - Math.max(r / 255, g / 255, b / 255);
  const cyan = Math.round(((1 - r / 255 - k) / (1 - k) || 0) * 100);
  const magenta = Math.round(((1 - g / 255 - k) / (1 - k) || 0) * 100);
  const yellow = Math.round(((1 - b / 255 - k) / (1 - k) || 0) * 100);
  const keyBlack = Math.round(k * 100);

  return {
    hex: hex.toUpperCase(),
    rgb: `RGB(${r}, ${g}, ${b})`,
    hsl: `HSL(${Math.round(h || 0)}°, ${Math.round((s || 0) * 100)}%, ${Math.round((l || 0) * 100)}%)`,
    cmyk: `CMYK(${cyan}%, ${magenta}%, ${yellow}%, ${keyBlack}%)`,
  };
}

/**
 * Evalúa el ratio de contraste WCAG 2.1 entre texto y fondo (RF-12)
 */
export function calculateContrastRatio(textHex: string, bgHex: string): { ratio: number; isAccessible: boolean } {
  const ratio = Number(chroma.contrast(textHex, bgHex).toFixed(2));
  // Estándar WCAG AA para texto normal exige ratio >= 4.5:1
  const isAccessible = ratio >= 4.5;
  return { ratio, isAccessible };
}

/**
 * Simula daltonismo aplicando matrices de reducción de color
 */
export function simulateDaltonism(hex: string, type: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'): string {
  if (type === 'normal') return hex;
  
  try {
    const color = chroma(hex);
    const [r, g, b] = color.rgb();
    
    let rSim = r;
    let gSim = g;
    let bSim = b;
    
    if (type === 'protanopia') {
      rSim = 0.567 * r + 0.433 * g;
      gSim = 0.558 * r + 0.442 * g;
      bSim = 0.242 * g + 0.758 * b;
    } else if (type === 'deuteranopia') {
      rSim = 0.625 * r + 0.375 * g;
      gSim = 0.7 * r + 0.3 * g;
      bSim = 0.3 * g + 0.7 * b;
    } else if (type === 'tritanopia') {
      rSim = 0.95 * r + 0.05 * g;
      gSim = 0.433 * r + 0.567 * g;
      bSim = 0.475 * r + 0.525 * g;
    } else if (type === 'achromatopsia') {
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      rSim = l;
      gSim = l;
      bSim = l;
    }
    
    // Clamp values between 0 and 255
    rSim = Math.max(0, Math.min(255, Math.round(rSim)));
    gSim = Math.max(0, Math.min(255, Math.round(gSim)));
    bSim = Math.max(0, Math.min(255, Math.round(bSim)));
    
    return chroma(rSim, gSim, bSim).hex().toUpperCase();
  } catch {
    return hex;
  }
}

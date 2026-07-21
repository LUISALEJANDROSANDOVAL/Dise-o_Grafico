import chroma from 'chroma-js';

export type HarmonyType = 'complementary' | 'analogous' | 'triad' | 'monochrome';

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
  let paperBgHex = '#FAF6EF';
  let inkTextHex = '#241F1A';

  switch (harmonyType) {
    case 'complementary':
      // Contraste directo a 180 grados
      accentHex = color.set('hsl.h', '+180').hex().toUpperCase();
      break;
    case 'analogous':
      // Tono contiguo a 30 grados
      accentHex = color.set('hsl.h', '+30').hex().toUpperCase();
      break;
    case 'triad':
      // Tono en tríada a 120 grados
      accentHex = color.set('hsl.h', '+120').hex().toUpperCase();
      break;
    case 'monochrome':
      // Variación de luminosidad
      accentHex = color.brighten(1.2).hex().toUpperCase();
      break;
  }

  const accentColor = chroma(accentHex);
  const accentRgb = `rgb(${accentColor.rgb().join(', ')})`;

  return [
    { hex: mainHex, label: 'Matiz Principal', rgb: mainRgb },
    { hex: accentHex, label: 'Contraste Directo', rgb: accentRgb },
    { hex: paperBgHex, label: 'Fondo (Papel)', rgb: 'rgb(250, 246, 239)' },
    { hex: inkTextHex, label: 'Acento (Tinta)', rgb: 'rgb(36, 31, 26)' },
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

import { useSyncExternalStore } from 'react';

// --- Global Color Store ---
type ColorListener = (color: string) => void;
let currentColor = '#FF8000';
const colorListeners = new Set<ColorListener>();

export const colorStore = {
  getColor: () => currentColor,
  setColor: (color: string) => {
    if (currentColor !== color) {
      currentColor = color;
      colorListeners.forEach((listener) => listener(color));
    }
  },
  subscribe: (listener: ColorListener) => {
    colorListeners.add(listener);
    return () => colorListeners.delete(listener);
  }
};

export function useGlobalColor() {
  return useSyncExternalStore(colorStore.subscribe, colorStore.getColor);
}

// --- Global Palette Store (Memory fallback for AsyncStorage) ---
type PaletteListener = (palette: any) => void;

let currentPalette = {
  baseColor: '#FF8000',
  harmony: 'complementary',
  swatches: [
    { hex: '#FF8000', label: 'Matiz Principal', rgb: 'rgb(255, 128, 0)' },
    { hex: '#0080FF', label: 'Contraste Directo', rgb: 'rgb(0, 128, 255)' },
    { hex: '#FAF6EF', label: 'Fondo (Papel)', rgb: 'rgb(250, 246, 239)' },
    { hex: '#241F1A', label: 'Acento (Tinta)', rgb: 'rgb(36, 31, 26)' },
  ]
};
const paletteListeners = new Set<PaletteListener>();

export const paletteStore = {
  getPalette: () => currentPalette,
  setPalette: (palette: any) => {
    currentPalette = palette;
    paletteListeners.forEach((listener) => listener(palette));
  },
  subscribe: (listener: PaletteListener) => {
    paletteListeners.add(listener);
    return () => paletteListeners.delete(listener);
  }
};

export function useGlobalPalette() {
  return useSyncExternalStore(paletteStore.subscribe, paletteStore.getPalette);
}

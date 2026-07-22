import { useSyncExternalStore } from 'react';

type Listener = (color: string) => void;

let currentColor = '#FF8000'; // Color base inicial por defecto
const listeners = new Set<Listener>();

export const colorStore = {
  getColor: () => currentColor,
  setColor: (color: string) => {
    if (currentColor !== color) {
      currentColor = color;
      listeners.forEach((listener) => listener(color));
    }
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

/**
 * Hook personalizado para usar el color global en cualquier componente.
 * Utiliza useSyncExternalStore para integración perfecta con React.
 */
export function useGlobalColor() {
  return useSyncExternalStore(colorStore.subscribe, colorStore.getColor);
}

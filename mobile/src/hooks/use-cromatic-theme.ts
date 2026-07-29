import { useColorScheme } from 'nativewind';
import { ViewStyle, TextStyle } from 'react-native';

export const cromaticColors = {
  light: {
    bg: '#FAF6EF',
    background: '#fff8f1',
    surface: '#f9f3eb',
    surfaceLow: '#f9f3eb',
    card: '#f0ebe2',
    cardElevated: '#ffffff',
    text: '#241F1A',
    textMuted: '#66645f',
    textSecondary: '#605e59',
    icon: '#0b0704',
    border: 'rgba(36, 31, 26, 0.08)',
    borderStrong: 'rgba(36, 31, 26, 0.12)',
    handle: 'rgba(36, 31, 26, 0.15)',
    chipBg: '#f9f3eb',
    filterActiveBg: '#241F1A',
    filterActiveText: '#FAF6EF',
    closeBtnBg: 'rgba(36, 31, 26, 0.07)',
    emptyOuter: '#f0ebe2',
    qrFg: '#241F1A',
    qrBg: '#FFFFFF',
    // Botones (modelo claro)
    buttonBg: '#FFFFFF',
    buttonBgActive: '#241F1A',
    buttonBorder: 'rgba(36, 31, 26, 0.12)',
    buttonText: '#241F1A',
    buttonTextOnActive: '#FAF6EF',
    buttonTextMuted: '#605e59',
  },
  dark: {
    bg: '#1a1714',
    background: '#1a1714',
    surface: '#24201c',
    surfaceLow: '#24201c',
    card: '#2a2622',
    cardElevated: '#2e2a26',
    text: '#FFFFFF',
    textMuted: '#b0aca6',
    textSecondary: '#c8c4be',
    icon: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.12)',
    borderStrong: '#332d2a',
    handle: 'rgba(255, 255, 255, 0.25)',
    chipBg: '#1a1714',
    // Selección tipo simulador (pill suave oscuro + texto blanco)
    filterActiveBg: '#2a2422',
    filterActiveText: '#FFFFFF',
    closeBtnBg: 'rgba(255, 255, 255, 0.1)',
    emptyOuter: '#2a2622',
    qrFg: '#FFFFFF',
    qrBg: '#1a1714',
    // Botones (modelo oscuro del simulador)
    buttonBg: '#1a1614',
    buttonBgActive: '#2a2422',
    buttonBorder: '#332d2a',
    buttonText: '#FFFFFF',
    buttonTextOnActive: '#FFFFFF',
    buttonTextMuted: '#d1cdc7',
  },
} as const;

export type CromaticTheme = typeof cromaticColors.light | typeof cromaticColors.dark;

/** Estilo base de botón (modo claro = claro, modo oscuro = modelo simulador) */
export function buttonStyle(colors: CromaticTheme, active = false): ViewStyle {
  return {
    backgroundColor: active ? colors.buttonBgActive : colors.buttonBg,
    borderWidth: 1,
    borderColor: colors.buttonBorder,
    borderRadius: 12,
  };
}

export function buttonTextStyle(colors: CromaticTheme, active = false): TextStyle {
  return {
    color: active ? colors.buttonTextOnActive : colors.buttonText,
  };
}

export function useCromaticTheme() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return {
    isDark,
    colors: isDark ? cromaticColors.dark : cromaticColors.light,
  };
}

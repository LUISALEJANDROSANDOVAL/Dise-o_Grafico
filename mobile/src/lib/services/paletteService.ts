import { supabase } from '../supabase';
import { initAnonymousSession } from './authService';
import { SwatchData } from '../colorEngine';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'cromatic_user_id';

/**
 * Obtiene o persiste el userId activo de forma robusta.
 * Guarda el userId en una clave propia de AsyncStorage como doble respaldo.
 */
async function getRobustUserId(): Promise<string | null> {
  const sessionUserId = await initAnonymousSession();
  if (sessionUserId) {
    // Siempre actualizar el respaldo local con el ID más reciente
    try { await AsyncStorage.setItem(USER_ID_KEY, sessionUserId); } catch {}
    return sessionUserId;
  }
  // Fallback: leer el respaldo local si la sesión falló
  try {
    const cached = await AsyncStorage.getItem(USER_ID_KEY);
    if (cached) return cached;
  } catch {}
  return null;
}

export interface SavedPalette {
  id?: string;
  usuario_id?: string;
  color_base: string;
  esquema_tipo: string;
  colores: SwatchData[];
  creado_en?: string;
}

/**
 * Persiste una paleta cromática en la tabla public.paletas (RF-07, RF-10)
 */
export async function savePalette(colorBase: string, esquemaTipo: string, colores: SwatchData[]): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const userId = await getRobustUserId();

    const payload = {
      usuario_id: userId || null,
      color_base: colorBase,
      esquema_tipo: esquemaTipo,
      colores: colores,
    };

    const { data, error } = await supabase
      .from('paletas')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      console.error('Error Supabase insert paleta:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('Error al guardar paleta:', err);
    return { success: false, error: err?.message || 'Error inesperado' };
  }
}

/**
 * Obtiene el historial de paletas guardadas por el usuario activo
 */
export async function getUserPalettes(): Promise<SavedPalette[]> {
  try {
    const userId = await getRobustUserId();
    console.log('[Paletas] userId activo:', userId);
    if (!userId) return [];

    const { data, error } = await supabase
      .from('paletas')
      .select('*')
      .eq('usuario_id', userId)
      .order('creado_en', { ascending: false });

    console.log('[Paletas] resultado:', data?.length ?? 0, 'paletas | error:', error?.message ?? 'ninguno');

    if (error) {
      console.error('Error Supabase fetch paletas:', error.message);
      return [];
    }

    return data as SavedPalette[];
  } catch (err) {
    console.error('Error en getUserPalettes:', err);
    return [];
  }
}

/**
 * Recupera una paleta por su ID para compartir mediante enlace/QR (RF-20)
 */
export async function getPaletteById(id: string): Promise<SavedPalette | null> {
  try {
    const { data, error } = await supabase
      .from('paletas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as SavedPalette;
  } catch (err) {
    console.error('Error al obtener paleta por ID:', err);
    return null;
  }
}

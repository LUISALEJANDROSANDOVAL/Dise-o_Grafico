import { supabase } from '../supabase';
import { initAnonymousSession } from './authService';
import { SwatchData } from '../colorEngine';

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
    const userId = await initAnonymousSession();

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
    const userId = await initAnonymousSession();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('paletas')
      .select('*')
      .eq('usuario_id', userId)
      .order('creado_en', { ascending: false });

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

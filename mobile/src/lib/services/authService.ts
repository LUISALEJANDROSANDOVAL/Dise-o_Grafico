import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  email?: string;
  rol: 'disenador' | 'microempresario' | 'anonimo';
  nombre_marca?: string;
  rubro?: string;
  creado_en?: string;
}

/**
 * Inicializa una sesión anónima transparente en Supabase (RF-01 / RNF-08)
 */
export async function initAnonymousSession(): Promise<string | null> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session?.user) {
      return sessionData.session.user.id;
    }

    // Intentar inicio de sesión anónimo si no hay usuario
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.warn('Advertencia Supabase Anonymous Auth:', error.message);
      return null;
    }

    const userId = data.user?.id;
    if (userId) {
      // Crear fila inicial en perfiles
      await supabase.from('perfiles').upsert({
        id: userId,
        rol: 'anonimo',
      }, { onConflict: 'id' });
    }

    return userId || null;
  } catch (err) {
    console.error('Error al inicializar sesión anónima:', err);
    return null;
  }
}

/**
 * Actualiza los datos del perfil (nombre de marca, rubro, rol) en public.perfiles (RF-01, RF-02)
 */
export async function saveUserProfile(data: { nombre_marca?: string; rubro?: string; rol?: 'disenador' | 'microempresario' | 'anonimo' }) {
  try {
    const userId = await initAnonymousSession();
    if (!userId) return false;

    const { error } = await supabase.from('perfiles').upsert({
      id: userId,
      ...data,
    });

    if (error) {
      console.error('Error al guardar perfil en Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error en saveUserProfile:', err);
    return false;
  }
}

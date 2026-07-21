import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Memoria fallback segura para evitar errores de Native module en Expo Go
const memoryStorage: Record<string, string> = {};

const ExpoStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? value : memoryStorage[key] || null;
    } catch {
      return memoryStorage[key] || null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      memoryStorage[key] = value;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      delete memoryStorage[key];
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://sstkjxhlpjkeapenojxx.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

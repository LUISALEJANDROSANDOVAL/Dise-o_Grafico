import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useState, useMemo, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type BrandVibe = 'luxury' | 'tech' | 'trust' | 'energy';

interface VibeOption {
  id: BrandVibe;
  label: string;
  fontClass: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  prefixes: string[];
  suffixes: string[];
  color: string;
}

const VIBE_OPTIONS: VibeOption[] = [
  {
    id: 'luxury',
    label: 'Elegancia & Lujo',
    fontClass: 'font-display-lg', // Serif
    description: 'Serif sofisticada de alto contraste, transmite exclusividad y herencia.',
    icon: 'diamond-outline',
    color: '#0b0704',
    prefixes: ['Maison', 'Atelier', 'Villa', 'Aura'],
    suffixes: ['& Co.', 'Studio', 'Noir', 'Essence'],
  },
  {
    id: 'tech',
    label: 'Innovación & Tech',
    fontClass: 'font-body-lg', // Sans-Serif clean
    description: 'Sans-Serif geométrica y minimalista, proyecta futuro y precisión.',
    icon: 'hardware-chip-outline',
    color: '#0055FF',
    prefixes: ['Neo', 'Syn', 'Omni', 'Nova'],
    suffixes: ['ify', 'io', 'Tech', 'Labs'],
  },
  {
    id: 'trust',
    label: 'Cercanía & Confianza',
    fontClass: 'font-headline-md', // Serif cálida
    description: 'Serif de autor con carácter cálido, ideal para servicios y hospitalidad.',
    icon: 'heart-half-outline',
    color: '#2A4B3C',
    prefixes: ['Casa', 'Tierra', 'Puro', 'Alma'],
    suffixes: ['Care', 'Roots', 'Vida', 'Well'],
  },
  {
    id: 'energy',
    label: 'Energía & Juventud',
    fontClass: 'font-label-caps', // Modular
    description: 'Tipografía modular y audaz, captura la atención al instante.',
    icon: 'flash-outline',
    color: '#FF4500',
    prefixes: ['Go', 'Zap', 'Max', 'Vibe'],
    suffixes: ['Up', 'Now', 'X', 'Pop'],
  },
];

export default function NamingScreen() {
  const [brandName, setBrandName] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<BrandVibe>('luxury');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentVibe = useMemo(() => {
    return VIBE_OPTIONS.find((opt) => opt.id === selectedVibe) || VIBE_OPTIONS[0];
  }, [selectedVibe]);

  // Animación de aparición suave al escribir el nombre
  useEffect(() => {
    if (brandName.trim().length > 1) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [brandName, fadeAnim]);

  // Análisis Semántico Simulado (Premium)
  const semanticAnalysis = useMemo(() => {
    const cleanName = brandName.trim().toUpperCase();
    if (cleanName.length < 2) return null;

    let strength = 'Media';
    let memorability = 'Media';
    let phonetic = 'Fluida';

    // Análisis de Fuerza (Letras fuertes)
    if (/[KXZVQ]/.test(cleanName)) {
      strength = 'Alta (Contundente)';
    }

    // Análisis de Memorabilidad (Longitud)
    if (cleanName.length <= 5) {
      memorability = 'Muy Alta (Corto y directo)';
    } else if (cleanName.length > 9) {
      memorability = 'Baja (Difícil de recordar rápido)';
    }

    // Análisis Fonético (Vocales/Consonantes repetidas)
    const endsWithVowel = /[AEIOU]$/.test(cleanName);
    if (endsWithVowel) {
      phonetic = 'Melódica (Fácil pronunciación global)';
    } else {
      phonetic = 'Asertiva (Terminación sólida)';
    }

    return { strength, memorability, phonetic };
  }, [brandName]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="w-full flex-row justify-between items-center h-touch-target px-margin-mobile border-b border-border-subtle bg-background">
        <TouchableOpacity className="active:scale-95">
          <Ionicons name="menu-outline" size={24} color="#0b0704" />
        </TouchableOpacity>
        <Text className="font-display-lg text-[32px] tracking-tight text-primary">
          RULEC
        </Text>
        <TouchableOpacity className="active:scale-95">
          <Ionicons name="person-circle-outline" size={24} color="#0b0704" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-margin-mobile pt-8 pb-32">
        <View className="mb-8">
          <Text className="font-headline-md text-[32px] text-primary mb-2">Laboratorio Premium</Text>
          <Text className="font-body-lg text-[18px] text-secondary">
            Construye la identidad verbal de tu marca a través de estrategia y neurociencia aplicada.
          </Text>
        </View>

        {/* PASO 1: EL PROPÓSITO (LA VIBRA) */}
        <View className="mb-10">
          <Text className="font-label-caps text-[12px] text-secondary mb-4 uppercase tracking-widest">
            Fase 1: ¿Qué debe transmitir tu marca?
          </Text>
          <View className="flex-col gap-3">
            {VIBE_OPTIONS.map((opt) => {
              const isSelected = opt.id === selectedVibe;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedVibe(opt.id)}
                  className={`p-4 rounded-xl border flex-row items-center justify-between ${
                    isSelected 
                      ? 'bg-ink-text border-ink-text shadow-sm' 
                      : 'bg-surface-container-lowest border-border-subtle'
                  }`}
                >
                  <View className="flex-row items-center gap-4">
                    <View 
                      className={`w-10 h-10 rounded-full items-center justify-center ${isSelected ? '' : 'bg-surface-container'}`}
                      style={isSelected ? { backgroundColor: 'rgba(249, 243, 235, 0.2)' } : undefined}
                    >
                      <Ionicons 
                        name={opt.icon} 
                        size={20} 
                        color={isSelected ? '#FAF6EF' : '#605e59'} 
                      />
                    </View>
                    <Text 
                      className={`font-headline-sm text-[16px] ${
                        isSelected ? 'text-paper-bg' : 'text-primary'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark" size={20} color="#FAF6EF" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* PASO 2: EL LABORATORIO (INPUT) */}
        <View className="mb-10">
          <Text className="font-label-caps text-[12px] text-secondary mb-4 uppercase tracking-widest">
            Fase 2: Analizador Semántico
          </Text>
          <View className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6 items-center justify-center mb-6 shadow-sm">
            <TextInput
              className="w-full h-[60px] text-center font-display-lg text-[32px] text-primary"
              placeholder="Ingresa tu idea..."
              placeholderTextColor="rgba(135, 135, 139, 0.4)"
              value={brandName}
              onChangeText={setBrandName}
              autoCapitalize="words"
              autoCorrect={false}
              underlineColorAndroid="transparent" 
            />
            <View className="w-16 h-[2px] bg-border-subtle mt-2 rounded-full" />
          </View>

          {/* DESBLOQUEADOR (INSPIRACIÓN) */}
          {brandName.trim().length === 0 && (
            <Animated.View style={{ opacity: 1 }} className="mt-2">
              <Text className="font-label-caps text-[10px] text-secondary mb-3 uppercase tracking-wider text-center">
                Sugerencias para {currentVibe.label}:
              </Text>
              <View className="flex-row flex-wrap justify-center gap-2">
                {currentVibe.prefixes.map(p => (
                  <TouchableOpacity key={p} onPress={() => setBrandName(p)} className="px-3 py-1.5 bg-surface-container border border-border-subtle rounded-md">
                    <Text className="font-body-md text-[13px] text-secondary">{p}...</Text>
                  </TouchableOpacity>
                ))}
                {currentVibe.suffixes.map(s => (
                  <TouchableOpacity key={s} onPress={() => setBrandName(s)} className="px-3 py-1.5 bg-surface-container border border-border-subtle rounded-md">
                    <Text className="font-body-md text-[13px] text-secondary">...{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}
        </View>

        {/* PASO 3: LA MAGIA (RESULTADOS) */}
        {semanticAnalysis && (
          <Animated.View style={{ opacity: fadeAnim }} className="mb-10">
            <Text className="font-label-caps text-[12px] text-secondary mb-4 uppercase tracking-widest">
              Fase 3: Diagnóstico y Match Visual
            </Text>
            
            {/* MATCH VISUAL (PREVIEW) */}
            <View className="bg-primary rounded-2xl p-8 items-center justify-center min-h-[220px] mb-4 shadow-lg overflow-hidden relative">
              {/* Decorative elements */}
              <View className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
              <View className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full" />
              
              <Text className="font-label-caps text-[10px] text-white/50 uppercase tracking-widest absolute top-6">
                Identidad Recomendada
              </Text>
              
              <Text 
                className={`${currentVibe.fontClass} text-[48px] text-white text-center leading-tight`}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {brandName}
              </Text>
            </View>

            {/* ANÁLISIS SEMÁNTICO */}
            <View className="bg-surface-container-lowest rounded-xl border border-border-subtle p-6 gap-4 shadow-sm">
              <View className="flex-row items-start gap-3 border-b border-border-subtle pb-4">
                <View className="w-8 h-8 rounded-full bg-surface-container items-center justify-center mt-1">
                  <Ionicons name="bar-chart-outline" size={16} color="#0b0704" />
                </View>
                <View className="flex-1">
                  <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-wider mb-1">Impacto de Fuerza</Text>
                  <Text className="font-body-lg text-[15px] text-primary">{semanticAnalysis.strength}</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3 border-b border-border-subtle pb-4">
                <View className="w-8 h-8 rounded-full bg-surface-container items-center justify-center mt-1">
                  <Ionicons name="bulb-outline" size={16} color="#0b0704" />
                </View>
                <View className="flex-1">
                  <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-wider mb-1">Memorabilidad</Text>
                  <Text className="font-body-lg text-[15px] text-primary">{semanticAnalysis.memorability}</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3 border-b border-border-subtle pb-4">
                <View className="w-8 h-8 rounded-full bg-surface-container items-center justify-center mt-1">
                  <Ionicons name="mic-outline" size={16} color="#0b0704" />
                </View>
                <View className="flex-1">
                  <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-wider mb-1">Estructura Fonética</Text>
                  <Text className="font-body-lg text-[15px] text-primary">{semanticAnalysis.phonetic}</Text>
                </View>
              </View>

              <View className="flex-row items-start gap-3 pt-2">
                <View className="w-8 h-8 rounded-full bg-surface-container items-center justify-center mt-1">
                  <Ionicons name="text-outline" size={16} color="#0b0704" />
                </View>
                <View className="flex-1">
                  <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-wider mb-1">Match Tipográfico</Text>
                  <Text className="font-body-lg text-[15px] text-primary leading-relaxed">{currentVibe.description}</Text>
                </View>
              </View>
            </View>

          </Animated.View>
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}

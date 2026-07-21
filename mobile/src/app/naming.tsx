import { View, Text, TextInput, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type IndustryStyle = 'editorial' | 'tech' | 'gastronomy' | 'minimalist';

interface StyleOption {
  id: IndustryStyle;
  label: string;
  fontClass: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'editorial',
    label: '🌿 Cosmética & Lujo',
    fontClass: 'font-display-lg',
    description: 'Serif sofisticada de alto contraste, perfecta para bienes de lujo y moda.',
    icon: 'sparkles-outline',
  },
  {
    id: 'tech',
    label: '⚡ Tech & Digital',
    fontClass: 'font-body-lg',
    description: 'Sans-Serif geométrica y ultra-limpia para Startups y herramientas SaaS.',
    icon: 'flash-outline',
  },
  {
    id: 'gastronomy',
    label: '☕ Gastronomía',
    fontClass: 'font-headline-md',
    description: 'Serif de autor con carácter cálido para café, repostería y cocina boutique.',
    icon: 'cafe-outline',
  },
  {
    id: 'minimalist',
    label: '🎯 Estudio Creativo',
    fontClass: 'font-label-caps',
    description: 'Tipografía neutra y modular para estudios de arquitectura y diseño.',
    icon: 'prism-outline',
  },
];

const INSPIRATION_SUGGESTIONS = [
  'Aura', 'Noir', 'Essence', 'Studio', 'Kura', 'Vanguard', 'Botanica', 'Zenith', 'Verde', 'Minimal'
];

export default function NamingScreen() {
  const [brandName, setBrandName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<IndustryStyle>('editorial');

  const currentOption = useMemo(() => {
    return STYLE_OPTIONS.find((opt) => opt.id === selectedStyle) || STYLE_OPTIONS[0];
  }, [selectedStyle]);

  // Algoritmo de Evaluación de Naming en Tiempo Real (Health Check)
  const namingMetrics = useMemo(() => {
    const cleanName = brandName.trim();
    if (!cleanName) {
      return { score: 0, lengthText: 'Esperando nombre...', scoreColor: 'text-secondary', badgeBg: 'bg-surface-container' };
    }

    const len = cleanName.length;
    let lengthScore = 100;
    let lengthText = 'Brevedad perfecta (< 8 letras)';

    if (len > 12) {
      lengthScore = 40;
      lengthText = 'Demasiado largo (> 12 letras)';
    } else if (len >= 8) {
      lengthScore = 75;
      lengthText = 'Longitud moderada (8-12 letras)';
    }

    // Evaluación de fonética básica (vocal al final favorece la fluidez en español)
    const endsWithVowel = /[aeiouáéíóúAEIOUÁÉÍÓÚ]$/.test(cleanName);
    const phoneticsScore = endsWithVowel ? 95 : 80;

    const totalScore = Math.round((lengthScore * 0.6) + (phoneticsScore * 0.4));

    let scoreColor = 'text-[#2A4B3C]';
    let badgeBg = 'bg-[#2A4B3C]/10';
    if (totalScore < 60) {
      scoreColor = 'text-error';
      badgeBg = 'bg-error-container';
    } else if (totalScore < 80) {
      scoreColor = 'text-[#FF8000]';
      badgeBg = 'bg-[#FF8000]/10';
    }

    return { score: totalScore, lengthText, scoreColor, badgeBg };
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
        {/* Title Section */}
        <View className="mb-8">
          <Text className="font-headline-md text-[32px] text-primary mb-2">Arte del Naming</Text>
          <Text className="font-body-lg text-[18px] text-secondary">
            Un gran nombre es el cimiento de una marca perdurable. Explora los principios y evalúa tu identidad en tiempo real.
          </Text>
        </View>

        {/* Educational Cards */}
        <View className="gap-4 mb-section-gap">
          <EducationalCard 
            icon="reorder-two-outline"
            title="Brevedad" 
            description="Menos es más. Los nombres cortos son más fáciles de recordar, pronunciar y encajan mejor en entornos digitales limitados." 
          />
          <EducationalCard 
            icon="volume-medium-outline"
            title="Fonética" 
            description="¿Cómo suena en voz alta? Busca cadencia y fluidez. Evita combinaciones de letras disonantes o difíciles de deletrear." 
          />
          <EducationalCard 
            icon="finger-print"
            title="Identidad" 
            description="El nombre debe evocar la esencia, no solo describir la función. Busca una conexión emocional que resuene con tu público." 
          />
        </View>

        {/* ESTUDIO E INTERACTIVIDAD DE NAMING (EL PRODUCTO REAL) */}
        <View className="mb-8">
          <Text className="font-headline-sm text-[24px] text-primary mb-2">Laboratorio de Naming</Text>
          <Text className="font-body-md text-[14px] text-secondary mb-6">
            Escribe un nombre, selecciona la industria de tu negocio y evalúa su impacto visual y auditivo.
          </Text>

          {/* Selector de Industria / Estilo Tipográfico */}
          <Text className="font-label-caps text-[12px] text-secondary mb-3 uppercase">1. Selecciona el Rubro de la Marca</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full mb-6">
            <View className="flex-row gap-3 px-1">
              {STYLE_OPTIONS.map((opt) => {
                const isSelected = opt.id === selectedStyle;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedStyle(opt.id)}
                    className={`px-5 py-3 rounded-lg border flex-row items-center gap-2 ${
                      isSelected 
                        ? 'bg-ink-text border-ink-text' 
                        : 'bg-surface-container-lowest border-border-subtle'
                    }`}
                  >
                    <Ionicons 
                      name={opt.icon} 
                      size={18} 
                      color={isSelected ? '#FAF6EF' : '#605e59'} 
                    />
                    <Text 
                      className={`font-label-caps text-[12px] ${
                        isSelected ? 'text-paper-bg' : 'text-primary'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Canvas de Visualización e Input */}
          <View className="bg-surface-container-low rounded-xl border border-border-subtle p-6 items-center justify-center min-h-[280px] mb-6">
            {/* Preview Area */}
            <View className="w-full min-h-[110px] items-center justify-center border-b border-border-subtle pb-6 mb-6">
              <Text 
                className={`${currentOption.fontClass} text-[38px] text-primary text-center ${!brandName ? 'opacity-30' : 'opacity-100'}`}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {brandName || "Tu Visión Aquí"}
              </Text>
            </View>

            {/* Input Area */}
            <View className="w-full relative pt-6">
              <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest absolute top-0 left-0">
                Prueba tu nombre aquí
              </Text>
              <TextInput
                className="w-full h-touch-target border-b-2 border-border-subtle text-center font-body-md text-[18px] text-primary"
                placeholder="Escribe el nombre de tu marca..."
                placeholderTextColor="rgba(135, 135, 139, 0.5)"
                value={brandName}
                onChangeText={setBrandName}
                autoCapitalize="words"
                autoCorrect={false}
                underlineColorAndroid="transparent" 
              />
            </View>
          </View>


          {/* Diagnóstico en Tiempo Real (Naming Score) */}
          {brandName.trim().length > 0 && (
            <View className="bg-surface-container-lowest rounded-xl border border-border-subtle p-5 mb-8">
              <View className="flex-row justify-between items-center mb-4 border-b border-border-subtle pb-3">
                <Text className="font-headline-sm text-[18px] text-primary">Diagnóstico de Naming</Text>
                <View className={`px-3 py-1 rounded-full ${namingMetrics.badgeBg}`}>
                  <Text className={`font-label-caps text-[12px] ${namingMetrics.scoreColor}`}>
                    Score: {namingMetrics.score} / 100
                  </Text>
                </View>
              </View>

              <View className="gap-3">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="checkmark-circle-outline" size={18} color="#2A4B3C" />
                  <Text className="font-body-md text-[14px] text-secondary flex-1">
                    {namingMetrics.lengthText}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="text-outline" size={18} color="#2A4B3C" />
                  <Text className="font-body-md text-[14px] text-secondary flex-1">
                    Tipografía recomendada: <Text className="text-primary font-medium">{currentOption.description}</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Generador de Inspiración (Chips de sugerencias) */}
          <Text className="font-label-caps text-[12px] text-secondary mb-3 uppercase">2. ¿Necesitas inspiración? Toca un prefijo:</Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {INSPIRATION_SUGGESTIONS.map((word) => (
              <TouchableOpacity
                key={word}
                activeOpacity={0.7}
                onPress={() => setBrandName(word)}
                className="px-3 py-1.5 bg-surface-container-low border border-border-subtle rounded-md"
              >
                <Text className="font-button-text text-[13px] text-ink-text">+ {word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

function EducationalCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <TouchableOpacity activeOpacity={0.7} className="border border-border-subtle bg-surface-container-lowest rounded-xl p-6 flex-col gap-4">
      <View className="w-12 h-12 rounded-full bg-surface-container items-center justify-center">
        <Ionicons name={icon} size={24} color="#0b0704" />
      </View>
      <View>
        <Text className="font-headline-sm text-[24px] text-primary mb-2">{title}</Text>
        <Text className="font-body-md text-[16px] text-secondary">{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

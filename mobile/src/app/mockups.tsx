import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateContrastRatio, simulateDaltonism } from '../lib/colorEngine';

const DEFAULT_PALETTE = {
  baseColor: '#FF8000',
  harmony: 'complementary',
  swatches: [
    { hex: '#FF8000', label: 'Matiz Principal', rgb: 'rgb(255, 128, 0)' },
    { hex: '#0080FF', label: 'Contraste Directo', rgb: 'rgb(0, 128, 255)' },
    { hex: '#FAF6EF', label: 'Fondo (Papel)', rgb: 'rgb(250, 246, 239)' },
    { hex: '#241F1A', label: 'Acento (Tinta)', rgb: 'rgb(36, 31, 26)' },
  ]
};

export default function MockupsScreen() {
  const [activePalette, setActivePalette] = useState(DEFAULT_PALETTE);
  const [daltonismType, setDaltonismType] = useState<'normal' | 'protanopia' | 'deuteranopia'>('normal');

  // Cargar paleta activa desde AsyncStorage al entrar en foco
  useFocusEffect(
    useCallback(() => {
      const loadPalette = async () => {
        try {
          const stored = await AsyncStorage.getItem('active_palette');
          if (stored) {
            setActivePalette(JSON.parse(stored));
          }
        } catch (err) {
          console.error('Error al cargar paleta activa en mockups:', err);
        }
      };
      loadPalette();
    }, [])
  );

  // Obtener colores básicos de la paleta
  const mainColorRaw = activePalette.swatches[0]?.hex || '#FF8000';
  const accentColorRaw = activePalette.swatches[1]?.hex || '#0080FF';
  const paperBgRaw = activePalette.swatches[2]?.hex || '#FAF6EF';
  const inkTextRaw = activePalette.swatches[3]?.hex || '#241F1A';

  // Aplicar simulación de Daltonismo
  const mainColor = simulateDaltonism(mainColorRaw, daltonismType);
  const accentColor = simulateDaltonism(accentColorRaw, daltonismType);
  const paperBg = simulateDaltonism(paperBgRaw, daltonismType);
  const inkColor = simulateDaltonism(inkTextRaw, daltonismType);

  // Calcular contrastes dinámicos WCAG
  // 1. Contraste de la Tarjeta de Presentación (Texto sobre color principal de fondo)
  const cardContrast = calculateContrastRatio(inkColor, mainColor);
  // 2. Contraste del Envase/Etiqueta (Texto sobre fondo papel de etiqueta)
  const labelContrast = calculateContrastRatio(inkColor, paperBg);

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

      <ScrollView className="flex-1 px-margin-mobile pt-6 pb-32">
        {/* Header Section */}
        <View className="mb-6">
          <Text className="font-display-lg text-[32px] font-bold text-primary mb-2 text-center">
            Visualización Real
          </Text>
          <Text className="font-body-md text-[15px] text-secondary text-center max-w-[320px] mx-auto leading-relaxed">
            Evaluación táctil de la paleta seleccionada sobre sustratos de papel, envases y validación de contraste accesible.
          </Text>
        </View>

        {/* Selector de Daltonismo */}
        <View className="mb-8 bg-surface-container-low p-1.5 rounded-xl border border-border-subtle">
          <Text className="font-label-caps text-[10px] text-secondary font-bold uppercase tracking-wider mb-1.5 text-center">
            Simulador de Visión / Daltonismo (RF-13)
          </Text>
          <View className="flex-row gap-1">
            {(['normal', 'protanopia', 'deuteranopia'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setDaltonismType(type)}
                style={daltonismType === type ? { backgroundColor: '#ffffff' } : null}
                className={`flex-1 py-2 px-2 rounded-lg items-center justify-center ${
                  daltonismType === type ? 'shadow-sm border border-border-subtle' : ''
                }`}
              >
                <Text
                  className={`font-label-caps text-[10px] font-bold uppercase tracking-wider ${
                    daltonismType === type ? 'text-primary' : 'text-secondary'
                  }`}
                >
                  {type === 'normal' ? 'Normal' : type === 'protanopia' ? 'Protanopía' : 'Deuteranopía'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mockup 1: Business Card */}
        <View className="items-center mb-10">
          <Text className="font-display-md text-[20px] font-bold text-primary mb-3">
            Tarjeta de Presentación (Aura Noir)
          </Text>
          <View className="w-full aspect-square bg-surface-container-low rounded-xl items-center justify-center border border-border-subtle relative overflow-hidden mb-4">
            <TouchableOpacity 
              activeOpacity={0.9} 
              style={[styles.paperShadow, { backgroundColor: mainColor }]}
              className="w-[280px] h-[160px] rounded-sm border border-border-subtle justify-between p-6"
            >
              <View className="flex-row justify-between items-start">
                <View style={{ backgroundColor: inkColor }} className="w-8 h-8 rounded-full items-center justify-center">
                  <Ionicons name="triangle-outline" size={16} color={mainColor} />
                </View>
                <Text style={{ color: inkColor }} className="font-label-caps text-[12px] font-bold uppercase tracking-widest">
                  Estudio
                </Text>
              </View>
              
              <View>
                <Text style={{ color: inkColor }} className="font-headline-sm text-[24px] font-bold mb-1">Aura Noir</Text>
                <Text style={{ color: inkColor }} className="font-body-md text-[14px] opacity-70">Dirección de Arte</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contrast Alert Badge */}
          <View className={`flex-row items-center justify-center gap-2 px-4 py-2 rounded-full border ${
            cardContrast.isAccessible 
              ? 'bg-[#E8F5E9] border-[#C8E6C9]' 
              : 'bg-[#FFEBEE] border-[#FFCDD2]'
          }`}>
            <Ionicons 
              name={cardContrast.isAccessible ? "checkmark-circle" : "warning-outline"} 
              size={18} 
              color={cardContrast.isAccessible ? "#2E7D32" : "#C62828"} 
            />
            <Text 
              style={{ color: cardContrast.isAccessible ? "#2E7D32" : "#C62828" }}
              className="font-label-caps text-[12px] font-bold uppercase"
            >
              {cardContrast.isAccessible ? 'Legibilidad: Alta' : 'Alerta: Contraste Bajo'} ({cardContrast.ratio}:1)
            </Text>
          </View>
        </View>

        {/* Mockup 2: Product Label */}
        <View className="items-center mb-16">
          <Text className="font-display-md text-[20px] font-bold text-primary mb-3">
            Etiqueta de Envase (No. 04)
          </Text>
          <View className="w-full aspect-square bg-surface-container-low rounded-xl items-center justify-center border border-border-subtle relative overflow-hidden mb-4">
            <TouchableOpacity 
              activeOpacity={0.9} 
              style={[styles.paperShadow, { backgroundColor: accentColor }]}
              className="w-[145px] h-[260px] rounded-t-[72px] rounded-b-md border border-border-subtle items-center pt-10 pb-8 px-4"
            >
              <View className="w-3.5 h-3.5 rounded-full border border-border-subtle absolute top-6" style={[styles.innerShadow, { backgroundColor: paperBg, borderColor: inkColor }]} />
              
              {/* Etiqueta Minimalista Blanca/Papel */}
              <View style={{ backgroundColor: paperBg, borderColor: inkColor }} className="items-center mt-6 w-full p-3 rounded border">
                <Text style={{ color: inkColor }} className="font-label-caps text-[10px] font-bold uppercase tracking-widest mb-2">Essence</Text>
                <View style={{ backgroundColor: inkColor }} className="w-full h-[1px] opacity-20 mb-2" />
                <Text style={{ color: inkColor }} className="font-headline-sm text-[18px] font-bold">No. 04</Text>
              </View>
              
              <View style={{ backgroundColor: paperBg, borderColor: inkColor }} className="items-center w-full mt-auto p-2 rounded border">
                <Text style={{ color: inkColor }} className="font-body-md text-[9px] font-bold text-center leading-tight">Botánica{"\n"}Sintética</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contrast Alert Badge */}
          <View className={`flex-row items-center justify-center gap-2 px-4 py-2 rounded-full border ${
            labelContrast.isAccessible 
              ? 'bg-[#E8F5E9] border-[#C8E6C9]' 
              : 'bg-[#FFEBEE] border-[#FFCDD2]'
          }`}>
            <Ionicons 
              name={labelContrast.isAccessible ? "checkmark-circle" : "warning-outline"} 
              size={18} 
              color={labelContrast.isAccessible ? "#2E7D32" : "#C62828"} 
            />
            <Text 
              style={{ color: labelContrast.isAccessible ? "#2E7D32" : "#C62828" }}
              className="font-label-caps text-[12px] font-bold uppercase"
            >
              {labelContrast.isAccessible ? 'Legibilidad: Alta' : 'Alerta: Contraste Bajo'} ({labelContrast.ratio}:1)
            </Text>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  paperShadow: {
    shadowColor: "#241f1a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  innerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: -1,
  }
});

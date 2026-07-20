import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PaletteScreen() {
  const [selectorPos, setSelectorPos] = useState({ x: 85, y: 25 });

  const handleWheelPress = () => {
    setSelectorPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-paper-bg">
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
        <View className="w-full items-center mb-12">
          <Text className="font-display-lg text-[32px] text-ink-text mb-4 text-center">
            Paleta de Color
          </Text>
          <Text className="font-body-md text-[16px] text-on-surface-variant text-center max-w-[300px]">
            Selecciona un matiz principal para generar una armonía cromática coherente para tu identidad de marca.
          </Text>
        </View>

        {/* Interactive Color Wheel Area */}
        <View className="w-full items-center mb-section-gap">
          <View className="relative w-[320px] h-[320px] items-center justify-center">
            {/* Base táctil */}
            <View className="absolute w-full h-full rounded-full border border-border-subtle bg-surface" style={styles.shadow} />
            
            {/* Rueda de colores con la imagen del gradiente cónico */}
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={handleWheelPress}
              className="relative w-[90%] h-[90%] rounded-full items-center justify-center overflow-hidden"
            >
              <Image 
                source={{ uri: 'https://raw.githubusercontent.com/react-native-color-picker/react-native-color-picker/master/assets/color-wheel.png' }}
                className="w-full h-full rounded-full"
                resizeMode="contain"
              />
              
              {/* Selector cuadrado redondeado según captura */}
              <View 
                className="absolute w-[44px] h-[44px] rounded-xl border border-ink-text bg-paper-bg items-center justify-center"
                style={{ left: `${selectorPos.x}%`, top: `${selectorPos.y}%`, transform: [{ translateX: -22 }, { translateY: -22 }] }}
              >
                <View className="w-3 h-3 rounded-full bg-[#ff8000]" />
              </View>
            </TouchableOpacity>

            {/* Recorte central cuadrado según captura */}
            <View className="absolute w-[40%] h-[40%] bg-paper-bg border border-border-subtle items-center justify-center z-10" style={styles.innerShadow}>
              <Text className="font-label-caps text-[12px] font-semibold tracking-widest text-on-surface-variant opacity-60">Base</Text>
            </View>
          </View>
        </View>

        {/* Harmony Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full mb-12">
          <View className="flex-row gap-4 px-2">
            <TouchableOpacity className="px-6 h-touch-target items-center justify-center rounded-[4px] bg-ink-text active:scale-95">
              <Text className="font-label-caps text-[12px] font-semibold tracking-widest text-paper-bg uppercase">Complementario</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 h-touch-target items-center justify-center rounded-[4px] border border-border-subtle bg-transparent active:scale-95">
              <Text className="font-label-caps text-[12px] font-semibold tracking-widest text-ink-text uppercase">Análogo</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 h-touch-target items-center justify-center rounded-[4px] border border-border-subtle bg-transparent active:scale-95">
              <Text className="font-label-caps text-[12px] font-semibold tracking-widest text-ink-text uppercase">Tríada</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Swatches Output (Tarjetas de colores con formato limpio y orden vertical para no encimarse) */}
        <View className="w-full flex-row flex-wrap justify-between gap-y-4">
          <Swatch color="#FF8000" label="Matiz Principal" />
          <Swatch color="#0080FF" label="Contraste Directo" />
          <Swatch color="#FAF6EF" label="Fondo (Papel)" />
          <Swatch color="#241F1A" label="Acento (Tinta)" />
        </View>
        
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

function Swatch({ color, label }: { color: string, label: string }) {
  return (
    <TouchableOpacity className="w-[48%] active:scale-[0.98]">
      <View 
        className="w-full h-32 rounded-[4px] border border-border-subtle mb-3" 
        style={{ backgroundColor: color }} 
      />
      <View className="px-1">
        <Text className="font-label-caps text-[12px] text-ink-text uppercase">{color}</Text>
        <Text className="font-body-md text-[12px] text-on-surface-variant mt-0.5">{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#241f1a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  innerShadow: {}
});

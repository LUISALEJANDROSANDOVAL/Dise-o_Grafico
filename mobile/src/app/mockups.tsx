import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function MockupsScreen() {
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
        {/* Header Section */}
        <View className="mb-12">
          <Text className="font-display-lg text-[32px] text-primary mb-4 text-center">
            Visualización Real
          </Text>
          <Text className="font-body-md text-[16px] text-secondary text-center max-w-[300px] mx-auto">
            Evaluación táctil de la paleta seleccionada sobre sustratos de papel y envases minimalistas.
          </Text>
        </View>

        {/* Mockup 1: Business Card */}
        <View className="items-center mb-12">
          <View className="w-full aspect-square bg-surface-container-low rounded-xl items-center justify-center border border-border-subtle relative overflow-hidden mb-6">
            <TouchableOpacity 
              activeOpacity={0.9} 
              className="w-[280px] h-[160px] bg-surface-container-lowest rounded-sm border border-border-subtle justify-between p-6"
              style={styles.paperShadow}
            >
              <View className="flex-row justify-between items-start">
                <View className="w-8 h-8 rounded-full bg-ink-text items-center justify-center">
                  <Ionicons name="triangle-outline" size={16} color="#ffffff" />
                </View>
                <Text className="font-label-caps text-[12px] text-secondary uppercase tracking-widest">
                  Estudio
                </Text>
              </View>
              
              <View>
                <Text className="font-headline-sm text-[24px] text-ink-text mb-1">Aura Noir</Text>
                <Text className="font-body-md text-[14px] text-secondary opacity-70">Dirección de Arte</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contrast Alert Badge */}
          <View className="flex-row items-center justify-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-surface-container-lowest">
            <Ionicons name="checkmark-circle" size={18} color="#645d57" />
            <Text className="font-label-caps text-[12px] text-secondary uppercase">Legibilidad: Alta</Text>
          </View>
        </View>

        {/* Mockup 2: Product Label */}
        <View className="items-center mb-12">
          <View className="w-full aspect-square bg-surface-container-low rounded-xl items-center justify-center border border-border-subtle relative overflow-hidden mb-6">
            <TouchableOpacity 
              activeOpacity={0.9} 
              className="w-[140px] h-[260px] bg-accent-warm rounded-t-[70px] rounded-b-md border border-border-subtle items-center pt-12 pb-8 px-6"
              style={styles.paperShadow}
            >
              <View className="w-3 h-3 rounded-full bg-surface-container-low border border-border-subtle absolute top-6" style={styles.innerShadow} />
              
              <View className="items-center mt-6 w-full">
                <Text className="font-label-caps text-[12px] text-ink-text opacity-60 uppercase tracking-widest mb-4">Essence</Text>
                <View className="w-full h-[1px] bg-ink-text opacity-10 mb-4" />
                <Text className="font-headline-sm text-[24px] text-ink-text">No. 04</Text>
              </View>
              
              <View className="items-center w-full mt-auto">
                <View className="w-full h-[1px] bg-ink-text opacity-10 mb-4" />
                <Text className="font-body-md text-[10px] text-ink-text opacity-70 text-center leading-tight">Botánica{"\n"}Sintética</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Contrast Alert Badge */}
          <View className="flex-row items-center justify-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-surface-container-lowest">
            <Ionicons name="contrast-outline" size={18} color="#645d57" />
            <Text className="font-label-caps text-[12px] text-secondary uppercase">Balance Óptimo</Text>
          </View>
        </View>

        <View className="h-20" />
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

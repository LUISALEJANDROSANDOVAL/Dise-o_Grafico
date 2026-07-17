import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PsychologyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="w-full flex-row justify-between items-center h-touch-target px-margin-mobile border-b border-border-subtle bg-background">
        <TouchableOpacity className="active:scale-95">
          <Ionicons name="menu-outline" size={24} color="#0b0704" />
        </TouchableOpacity>
        <Text className="font-display-lg text-[32px] font-bold tracking-tight text-primary">
          RULEC
        </Text>
        <TouchableOpacity className="active:scale-95">
          <Ionicons name="person-circle-outline" size={24} color="#0b0704" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-margin-mobile pt-8 pb-32">
        {/* Header Section */}
        <View className="mb-12">
          <Text className="font-display-lg text-[32px] font-bold text-ink-text mb-4">El Alma del Color</Text>
          <Text className="font-body-lg text-[18px] text-on-surface-variant max-w-[300px]">
            Descubre la narrativa oculta detrás de cada tono. La psicología del color es la herramienta más silenciosa pero poderosa.
          </Text>
        </View>

        {/* Color Focus Card */}
        <View className="mb-12">
          {/* Large Color Block */}
          <View 
            className="h-[400px] rounded-xl overflow-hidden border border-border-subtle justify-end p-8 mb-8"
            style={{ backgroundColor: '#2A4B3C' }}
          >
            <View className="relative z-10">
              <Text className="font-label-caps text-[12px] font-bold text-paper-bg opacity-80 mb-2 uppercase tracking-widest">Color en Foco</Text>
              <Text className="font-headline-md text-[32px] font-bold text-paper-bg leading-tight">Verde{"\n"}Bosque</Text>
              
              <View className="mt-8 pt-4 border-t border-white/20 flex-row justify-between items-center">
                <Text className="font-button-text text-[14px] text-paper-bg opacity-90 font-medium">HEX #2A4B3C</Text>
                <TouchableOpacity>
                  <Ionicons name="copy-outline" size={20} color="#FAF6EF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Editorial Info Panel */}
          <View>
            <Text className="font-headline-md text-[24px] font-bold text-ink-text mb-6 leading-tight">
              Naturaleza, Equilibrio y Crecimiento.
            </Text>
            
            {/* Párrafo 1 */}
            <Text className="font-body-md text-[16px] text-on-surface-variant mb-4 leading-relaxed">
              Este tono evoca la quietud inalterable de los bosques densos y la vitalidad silenciosa de la flora en crecimiento. En el contexto de marcas de lujo, bienestar o servicios financieros, el Verde Bosque comunica una estabilidad institucional, una conexión auténtica y enraizada con el entorno, y una promesa de crecimiento orgánico a largo plazo.
            </Text>
            
            {/* Párrafo 2 (Agregado para completar la psicología de límites del color) */}
            <Text className="font-body-md text-[16px] text-on-surface-variant mb-4 leading-relaxed">
              No es un tono de urgencia ni de innovación disruptiva; es una afirmación serena de presencia, herencia y salud perdurable. Es el color de la confianza madura.
            </Text>
            
            {/* Associated Emotions List (Tags) */}
            <View className="mt-8 pt-8 border-t border-border-subtle">
              <Text className="font-label-caps text-[12px] font-bold text-secondary mb-4 uppercase">Emociones Asociadas</Text>
              <View className="flex-row flex-wrap gap-3">
                <EmotionTag label="Estabilidad" />
                <EmotionTag label="Renovación" />
                <EmotionTag label="Prosperidad" />
                <EmotionTag label="Calma" />
                <EmotionTag label="Herencia" />
              </View>
            </View>
          </View>
        </View>

        {/* Inspiring Brands Grid */}
        <View className="mb-12">
          <View className="flex-row justify-between items-end border-b border-border-subtle pb-4 mb-8">
            <Text className="font-headline-sm text-[20px] font-bold text-ink-text">Marcas Inspiradoras</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="font-button-text text-[14px] font-medium text-secondary">Ver más</Text>
              <Ionicons name="arrow-forward" size={16} color="#605e59" />
            </TouchableOpacity>
          </View>

          <View className="gap-8">
            <BrandCase 
              title="Aesop"
              category="Cosmética Botánica"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuBxFmWJlwNKL2YLpw-CQ6Z8sMNSr233tG9oBreKe77nI4tMz9eUHVZlQcv4mo-6FyZb-7y83rbhyZ9Wqewmgv6JPRVaWzicoO0lhfhlfOWuUrkaZDPSKIQIURUUvqHE7Qp4MD3o3vhp6Ezw6rvNnrFXkC085ByJpXZvYaqPW5djWeW-snDOaKOOZLUKPElPA9UpCI1nhdonTUDfZr7EQBaWdgbhoEBa0rWMA0XtiB-ULbjIku0Wbgxqf8u8tRqLDzPKf0bh8oW_aWI"
            />
            <BrandCase 
              title="Vanguard L."
              category="Gestión Patrimonial"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuAJb9RWK6keJ2QcMEy3XV3K5mE-HoO7cYm5-51Ew5dUBWLTlG4FCR3g86-NaUi74pYzqCZCw5bNswvRyiKo7LYtcIxu_Ol8PpE78aDXDKX0gU2Z9zI9G-HN9LN9XT6kpWP70rSqDlxHMKIM-mhBmtESWigTmOx-VxI1dXkvL9qqnanCyiwSmtyudXJh5CAkL7Lrs0sjsGY7XO0SBCg5HAqvUd8afMv-VUTZeUIfvB0MsSU1G83CQnc-lrPhpml0CVzCzZXs0JzgDjk"
            />
            {/* Caso 3 (Kurasu - Agregado para completar la tríada de sectores) */}
            <BrandCase 
              title="Kurasu"
              category="Gastronomía Consciente"
              imageUri="https://lh3.googleusercontent.com/aida-public/AB6AXuBmSRGps862SsTMPVwhn0JVjMtDfpal0LxOnjAdxxaigHhghDGkzO_6D8_uAGEv1ARJtNGhTcpnLwF9zs0cjYbMCQ5ZnbEvi0j397NxQpzScnQTXldTUd-0SM9zdBCK28FgqcJW8pFJcf0Su2PJozjbrMSICtcMaljfqgsUwOpGUhLZ7Kyrn-TTNVX0YKFbRSF8TZL58oODglhlDVKudh-UqE8iCP9VhfO_m-WORaxdX43Z3M56LlGuaWFM3rBePwvJvIrD32cKalI"
            />
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

function EmotionTag({ label }: { label: string }) {
  return (
    <View className="px-4 py-2 bg-surface-container-low border border-border-subtle rounded-md">
      <Text className="text-ink-text font-button-text text-[14px] font-medium">{label}</Text>
    </View>
  );
}

function BrandCase({ title, category, imageUri }: { title: string, category: string, imageUri: string }) {
  return (
    <TouchableOpacity activeOpacity={0.8} className="w-full flex-col">
      <View className="w-full aspect-[4/3] bg-surface-container-low border border-border-subtle rounded-lg mb-4 overflow-hidden relative">
        <Image 
          source={{ uri: imageUri }} 
          className="w-full h-full opacity-90"
          resizeMode="cover"
        />
      </View>
      <Text className="font-label-caps text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{category}</Text>
      <Text className="font-headline-sm text-[24px] font-bold text-ink-text mt-1">{title}</Text>
    </TouchableOpacity>
  );
}

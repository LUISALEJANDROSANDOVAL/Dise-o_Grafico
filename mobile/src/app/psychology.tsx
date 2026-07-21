import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalColor } from '../lib/colorStore';
import { getPsychologyForColor } from '../lib/data/colorPsychology';

export default function PsychologyScreen() {
  const baseColorHex = useGlobalColor();
  const psychology = getPsychologyForColor(baseColorHex);

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
          <Text className="font-display-lg text-[32px] text-ink-text mb-4">El Alma del Color</Text>
          <Text className="font-body-lg text-[18px] text-on-surface-variant max-w-[300px]">
            Descubre la narrativa oculta detrás de cada tono. La psicología del color es la herramienta más silenciosa pero poderosa.
          </Text>
        </View>

        {/* Color Focus Card */}
        <View className="mb-12">
          {/* Large Color Block */}
          <View 
            className="h-[400px] rounded-xl overflow-hidden border border-border-subtle justify-end p-8 mb-8"
            style={{ backgroundColor: baseColorHex }}
          >
            <View className="relative z-10">
              <Text className="font-label-caps text-[12px] font-bold text-paper-bg opacity-80 mb-2 uppercase tracking-widest">Color en Foco</Text>
              <Text className="font-headline-md text-[32px] font-bold text-paper-bg leading-tight">{psychology.name}</Text>
              
              <View className="mt-8 pt-4 border-t border-white/20 flex-row justify-between items-center">
                <Text className="font-button-text text-[14px] text-paper-bg opacity-90 font-medium">HEX {baseColorHex}</Text>
                <TouchableOpacity>
                  <Ionicons name="copy-outline" size={20} color="#FAF6EF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Editorial Info Panel */}
          <View>
            <Text className="font-headline-md text-[24px] font-bold text-ink-text mb-6 leading-tight">
              {psychology.headline}
            </Text>
            
            {psychology.paragraphs.map((paragraph, idx) => (
              <Text key={idx} className="font-body-md text-[16px] text-on-surface-variant mb-4 leading-relaxed">
                {paragraph}
              </Text>
            ))}
            
            {/* Associated Emotions List (Tags) */}
            <View className="mt-8 pt-8 border-t border-border-subtle">
              <Text className="font-label-caps text-[12px] text-secondary mb-4 uppercase">Emociones Asociadas</Text>
              <View className="flex-row flex-wrap gap-3">
                {psychology.emotions.map((emotion, idx) => (
                  <EmotionTag key={idx} label={emotion} />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Inspiring Brands Grid */}
        <View className="mb-12">
          <View className="flex-row justify-between items-end border-b border-border-subtle pb-4 mb-8">
            <Text className="font-headline-sm text-[20px] text-ink-text">Marcas Inspiradoras</Text>
            <TouchableOpacity className="flex-row items-center gap-1">
              <Text className="font-button-text text-[14px] font-medium text-secondary">Ver más</Text>
              <Ionicons name="arrow-forward" size={16} color="#605e59" />
            </TouchableOpacity>
          </View>

          <View className="gap-8">
            {psychology.brands.map((brand, idx) => (
              <BrandCase 
                key={idx}
                title={brand.title}
                category={brand.category}
                imageUri={brand.imageUri}
              />
            ))}
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
      <Text className="font-label-caps text-[12px] text-on-surface-variant uppercase tracking-wider">{category}</Text>
      <Text className="font-headline-sm text-[24px] text-ink-text mt-1">{title}</Text>
    </TouchableOpacity>
  );
}

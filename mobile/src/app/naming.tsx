import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NamingScreen() {
  const [brandName, setBrandName] = useState('');

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
            Un gran nombre es el cimiento de una marca perdurable. Explora los principios fundamentales antes de acuñar tu identidad.
          </Text>
        </View>

        {/* Educational Cards */}
        <View className="gap-4 mb-section-gap">
          <EducationalCard 
            icon="reorder-two-outline" // Icono de dos líneas para Brevedad según captura
            title="Brevedad" 
            description="Menos es más. Los nombres cortos son más fáciles de recordar, pronunciar y encajan mejor en entornos digitales limitados." 
          />
          <EducationalCard 
            icon="volume-medium-outline" // Icono de altavoz con ondas para Fonética según captura
            title="Fonética" 
            description="¿Cómo suena en voz alta? Busca cadencia y fluidez. Evita combinaciones de letras disonantes o difíciles de deletrear al escucharlas." 
          />
          <EducationalCard 
            icon="finger-print" // Icono de huella digital de Ionicons
            title="Identidad" 
            description="El nombre debe evocar la esencia, no solo describir la función. Busca una conexión emocional que resuene con el aura de tu proyecto." 
          />
        </View>

        {/* Interactive Naming Studio */}
        <View className="bg-surface-container-low rounded-xl border border-border-subtle p-6 items-center justify-center min-h-[300px]">
          {/* Preview Area */}
          <View className="w-full min-h-[120px] items-center justify-center border-b border-border-subtle pb-6 mb-6">
            <Text 
              className={`font-display-lg text-[40px] text-primary text-center ${!brandName ? 'opacity-40' : 'opacity-100'}`}
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
              placeholder="Escribe para visualizar..."
              placeholderTextColor="rgba(135, 135, 139, 0.5)"
              value={brandName}
              onChangeText={setBrandName}
              autoCapitalize="words"
              autoCorrect={false}
              underlineColorAndroid="transparent" 
            />
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

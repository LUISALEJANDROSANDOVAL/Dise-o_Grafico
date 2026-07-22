import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
// Fuentes del catálogo de Naming
import { Cinzel_400Regular, Cinzel_700Bold } from '@expo-google-fonts/cinzel';
import { Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import { Oswald_400Regular, Oswald_700Bold } from '@expo-google-fonts/oswald';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { DancingScript_400Regular, DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';
import { Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Raleway_400Regular, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { SourceCodePro_400Regular } from '@expo-google-fonts/source-code-pro';
import { CormorantGaramond_400Regular, CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond';
import { DMSans_400Regular, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

// Previene que el Splash Screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const [loaded, error] = useFonts({
    // Fuentes base de la app
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PlayfairDisplay-SemiBold': PlayfairDisplay_600SemiBold,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    // Catálogo de Naming — Serif
    'Cinzel': Cinzel_400Regular,
    'Cinzel-Bold': Cinzel_700Bold,
    'Lora': Lora_400Regular,
    'Lora-Bold': Lora_700Bold,
    'CormorantGaramond': CormorantGaramond_400Regular,
    'CormorantGaramond-Bold': CormorantGaramond_700Bold,
    // Catálogo de Naming — Sans-Serif
    'Montserrat': Montserrat_400Regular,
    'Montserrat-Bold': Montserrat_700Bold,
    'Poppins': Poppins_400Regular,
    'Poppins-Bold': Poppins_700Bold,
    'Raleway': Raleway_400Regular,
    'Raleway-Bold': Raleway_700Bold,
    'DMSans': DMSans_400Regular,
    'DMSans-Bold': DMSans_700Bold,
    // Catálogo de Naming — Display
    'Oswald': Oswald_400Regular,
    'Oswald-Bold': Oswald_700Bold,
    'BebasNeue': BebasNeue_400Regular,
    // Catálogo de Naming — Script
    'Pacifico': Pacifico_400Regular,
    'DancingScript': DancingScript_400Regular,
    'DancingScript-Bold': DancingScript_700Bold,
    // Catálogo de Naming — Monospace
    'SpaceMono': SpaceMono_400Regular,
    'SourceCodePro': SourceCodePro_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          backgroundColor: '#f9f3eb',
          borderTopWidth: 1,
          borderTopColor: 'rgba(36, 31, 26, 0.08)',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#1d1b17',
        tabBarInactiveTintColor: '#66645f',
        tabBarLabelStyle: {
          fontFamily: 'Inter-SemiBold', // Cambiado a la fuente cargada
          fontSize: 10,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginTop: -5,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Palette',
          tabBarIcon: ({ color, focused }) => (
            <View 
              className={`items-center justify-center p-1 px-4 rounded-full ${focused ? '' : 'bg-transparent'}`}
              style={focused ? { backgroundColor: 'rgba(217, 210, 197, 0.2)' } : undefined}
            >
              <Ionicons name="color-palette" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="mockups"
        options={{
          title: 'Mockups',
          tabBarIcon: ({ color }) => <Ionicons name="layers-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="psychology"
        options={{
          title: 'Psychology',
          tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="naming"
        options={{
          title: 'Naming',
          tabBarIcon: ({ color }) => <Ionicons name="text-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

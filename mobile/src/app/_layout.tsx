import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';

// Previene que el Splash Screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const [loaded, error] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PlayfairDisplay-SemiBold': PlayfairDisplay_600SemiBold,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
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
            <View className={`items-center justify-center p-1 px-4 rounded-full ${focused ? 'bg-accent-warm/20' : 'bg-transparent'}`}>
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

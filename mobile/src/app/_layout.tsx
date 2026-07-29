import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
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
import { cromaticColors } from '@/hooks/use-cromatic-theme';
import { cromaticVars } from '@/constants/cromatic-vars';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const TAB_BAR_HEIGHT = 64;

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? cromaticColors.dark : cromaticColors.light;
  const themeVars = isDark ? cromaticVars.dark : cromaticVars.light;
  const tabBarBottomInset = Math.max(insets.bottom, 12);

  const [loaded, error] = useFonts({
    'Inter': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PlayfairDisplay-SemiBold': PlayfairDisplay_600SemiBold,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'Cinzel': Cinzel_400Regular,
    'Cinzel-Bold': Cinzel_700Bold,
    'Lora': Lora_400Regular,
    'Lora-Bold': Lora_700Bold,
    'CormorantGaramond': CormorantGaramond_400Regular,
    'CormorantGaramond-Bold': CormorantGaramond_700Bold,
    'Montserrat': Montserrat_400Regular,
    'Montserrat-Bold': Montserrat_700Bold,
    'Poppins': Poppins_400Regular,
    'Poppins-Bold': Poppins_700Bold,
    'Raleway': Raleway_400Regular,
    'Raleway-Bold': Raleway_700Bold,
    'DMSans': DMSans_400Regular,
    'DMSans-Bold': DMSans_700Bold,
    'Oswald': Oswald_400Regular,
    'Oswald-Bold': Oswald_700Bold,
    'BebasNeue': BebasNeue_400Regular,
    'Pacifico': Pacifico_400Regular,
    'DancingScript': DancingScript_400Regular,
    'DancingScript-Bold': DancingScript_700Bold,
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
    <View style={[{ flex: 1 }, themeVars]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: theme.bg },
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: TAB_BAR_HEIGHT + tabBarBottomInset,
            paddingBottom: tabBarBottomInset,
            backgroundColor: theme.surface,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarLabelStyle: {
            fontFamily: 'Inter-SemiBold',
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
                style={focused ? { backgroundColor: isDark ? 'rgba(249, 243, 235, 0.12)' : 'rgba(217, 210, 197, 0.2)' } : undefined}
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
        <Tabs.Screen
          name="paletas"
          options={{ href: null }}
        />
      </Tabs>
    </View>
  );
}

import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useCromaticTheme } from '@/hooks/use-cromatic-theme';
import { cromaticVars } from '@/constants/cromatic-vars';

const logoSource = require('../../assets/images/cromatic-logo.png');

type AppHeaderProps = {
  onProfilePress?: () => void;
  titleSize?: number;
};

export default function AppHeader({ onProfilePress, titleSize = 32 }: AppHeaderProps) {
  const { toggleColorScheme } = useColorScheme();
  const { colors, isDark } = useCromaticTheme();
  const themeVars = isDark ? cromaticVars.dark : cromaticVars.light;
  const logoSize = Math.max(30, Math.round(titleSize * 0.95));

  return (
    <View
      style={[{ minHeight: 56 }, themeVars]}
      className="w-full flex-row justify-between items-center px-margin-mobile py-2 border-b border-border-subtle bg-background"
    >
      <TouchableOpacity className="active:scale-95" accessibilityLabel="Menú">
        <Ionicons name="menu-outline" size={24} color={colors.icon} />
      </TouchableOpacity>

      <View
        className="flex-row items-center gap-2"
        accessibilityRole="header"
        accessibilityLabel="Cromatic"
      >
        <Image
          source={logoSource}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
        <Text
          className="font-display-lg tracking-tight text-primary"
          style={{ fontSize: titleSize }}
        >
          CROMATIC
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          className="active:scale-95"
          onPress={toggleColorScheme}
          accessibilityLabel="Modo oscuro"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="moon-outline" size={22} color={colors.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          className="active:scale-95"
          onPress={onProfilePress}
          accessibilityLabel="Perfil"
        >
          <Ionicons name="person-circle-outline" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

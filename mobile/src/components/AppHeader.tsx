import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useCromaticTheme } from '@/hooks/use-cromatic-theme';
import { cromaticVars } from '@/constants/cromatic-vars';

type AppHeaderProps = {
  onProfilePress?: () => void;
  titleSize?: number;
};

export default function AppHeader({ onProfilePress, titleSize = 32 }: AppHeaderProps) {
  const { toggleColorScheme } = useColorScheme();
  const { colors, isDark } = useCromaticTheme();
  const themeVars = isDark ? cromaticVars.dark : cromaticVars.light;

  return (
    <View
      style={themeVars}
      className="w-full flex-row justify-between items-center h-touch-target px-margin-mobile border-b border-border-subtle bg-background"
    >
      <TouchableOpacity className="active:scale-95" accessibilityLabel="Menú">
        <Ionicons name="menu-outline" size={24} color={colors.icon} />
      </TouchableOpacity>

      <Text
        className="font-display-lg tracking-tight text-primary"
        style={{ fontSize: titleSize }}
      >
        CROMATIC
      </Text>

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

import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Easing, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { getUserPalettes, SavedPalette } from '../lib/services/paletteService';
import { colorStore } from '../lib/colorStore';
import AppHeader from '../components/AppHeader';
import { useCromaticTheme, buttonStyle, buttonTextStyle } from '../hooks/use-cromatic-theme';
import { cromaticVars } from '../constants/cromatic-vars';

// ——————————————————————————————————————————
// Helper: formatear la fecha de forma legible
// ——————————————————————————————————————————
function formatDate(isoString?: string): string {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ——————————————————————————————————————————
// Nombre legible para cada esquema de armonía
// ——————————————————————————————————————————
const HARMONY_LABELS: Record<string, string> = {
  complementary: 'Complementario',
  analogous: 'Análogo',
  triad: 'Tríada',
  'split-complementary': 'Comp. Dividido',
  square: 'Cuadrado',
  tetradic: 'Tetrádico',
  monochrome: 'Monocromo',
};

// ——————————————————————————————————————————
// Tarjeta individual de paleta (PaletteCard)
// ——————————————————————————————————————————
function PaletteCard({ palette, onLoad, index }: { palette: SavedPalette; onLoad: (p: SavedPalette) => void; index: number }) {
  const { colors } = useCromaticTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        delay: index * 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const swatches = palette.colores?.slice(0, 5) ?? [];
  const baseHex = palette.color_base || swatches[0]?.hex || '#FF8000';
  const harmonyLabel = HARMONY_LABELS[palette.esquema_tipo] ?? palette.esquema_tipo ?? 'Personalizada';

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        onPress={() => onLoad(palette)}
        activeOpacity={0.85}
        className="mb-4 bg-surface-container-low border border-border-subtle rounded-2xl overflow-hidden"
      >
        {/* Banda de colores en la parte superior */}
        <View className="flex-row h-14 overflow-hidden">
          {swatches.length > 0
            ? swatches.map((s, i) => (
                <View key={i} style={{ flex: 1, backgroundColor: s.hex }} />
              ))
            : <View style={{ flex: 1, backgroundColor: baseHex }} />}
        </View>

        {/* Cuerpo de la tarjeta */}
        <View className="px-4 pt-4 pb-4">
          {/* Cabecera: color base + etiqueta de esquema */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View
                className="w-5 h-5 rounded-full border border-border-subtle"
                style={{ backgroundColor: baseHex }}
              />
              <Text className="font-button-text text-[14px] text-ink-text font-bold tracking-wide uppercase">
                {baseHex}
              </Text>
            </View>
            <View className="bg-surface-container-lowest border border-border-subtle rounded-full px-3 py-1">
              <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest">
                {harmonyLabel}
              </Text>
            </View>
          </View>

          {/* Colores como chips etiquetados */}
          {swatches.length > 0 && (
            <View className="flex-row flex-wrap gap-1.5 mb-3">
              {swatches.map((s, i) => (
                <View
                  key={i}
                  className="flex-row items-center gap-1 bg-background border border-border-subtle rounded-full pl-1.5 pr-2 py-0.5"
                >
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: s.hex }} />
                  <Text className="font-label-caps text-[9px] text-secondary uppercase tracking-wider">
                    {s.label?.split(' ')[0] ?? s.hex}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Footer: fecha + indicador de acción */}
          <View className="flex-row items-center justify-between pt-3 border-t border-border-subtle/50">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="time-outline" size={12} color={colors.textMuted} />
              <Text className="font-body-md text-[12px] text-secondary">
                {formatDate(palette.creado_en)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full px-3 py-1" style={{ backgroundColor: 'rgba(255,128,0,0.1)' }}>
              <Ionicons name="color-wand-outline" size={12} color="#FF8000" />
              <Text className="font-button-text text-[11px] font-bold" style={{ color: '#FF8000' }}>
                Cargar
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ——————————————————————————————————————————
// Pantalla vacía — cuando no hay paletas
// ——————————————————————————————————————————
function EmptyState({ fadeAnim }: { fadeAnim: Animated.Value }) {
  const { colors } = useCromaticTheme();
  return (
    <Animated.View style={{ opacity: fadeAnim }} className="flex-1 items-center justify-center pb-24 px-8 pt-8">
      {/* Ilustración circular doble */}
      <View className="w-28 h-28 rounded-full bg-surface-container-low border border-border-subtle items-center justify-center mb-6">
        <View className="w-16 h-16 rounded-full border-2 border-dashed border-border-subtle items-center justify-center">
          <Ionicons name="color-palette-outline" size={28} color={colors.textMuted} />
        </View>
      </View>

      <Text className="font-headline-md text-[22px] font-bold text-ink-text text-center leading-tight mb-3">
        Sin paletas guardadas
      </Text>
      <Text className="font-body-md text-[14px] text-secondary text-center leading-relaxed" style={{ maxWidth: 260 }}>
        Crea tu primera combinación cromática en la pestaña{' '}
        <Text className="font-bold" style={{ color: '#FF8000' }}>Paleta</Text>
        {' '}y guárdala aquí para usarla en tus proyectos.
      </Text>

      {/* Mini espectro decorativo */}
      <View className="flex-row mt-10 gap-1.5" style={{ opacity: 0.3 }}>
        {['#FF6B6B', '#FF8000', '#FFD93D', '#6BCB77', '#4D96FF', '#8B5CF6'].map((c, i) => (
          <View key={i} className="w-8 h-8 rounded-lg" style={{ backgroundColor: c }} />
        ))}
      </View>
    </Animated.View>
  );
}

// ——————————————————————————————————————————
// Pantalla principal: Mis Paletas
// ——————————————————————————————————————————
export default function PaletasScreen() {
  const router = useRouter();
  const setBaseColorHex = colorStore.setColor;
  const { colors, isDark } = useCromaticTheme();
  const themeVars = isDark ? cromaticVars.dark : cromaticVars.light;

  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'reciente' | 'armonia'>('reciente');

  const headerFade = useRef(new Animated.Value(0)).current;
  const emptyFade = useRef(new Animated.Value(0)).current;

  // Cargar paletas cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setError(null);
      headerFade.setValue(0);
      emptyFade.setValue(0);

      getUserPalettes()
        .then((data) => {
          setPalettes(data);
          setLoading(false);
          Animated.timing(headerFade, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start();
          if (data.length === 0) {
            Animated.timing(emptyFade, {
              toValue: 1,
              duration: 600,
              delay: 200,
              useNativeDriver: true,
            }).start();
          }
        })
        .catch(() => {
          setError('No se pudieron cargar las paletas. Revisa tu conexión a internet.');
          setLoading(false);
        });
    }, [])
  );

  // Carga una paleta en el motor de color global y ofrece navegar a Paleta
  function handleLoad(palette: SavedPalette) {
    if (palette.color_base) {
      setBaseColorHex(palette.color_base);
    }
    Alert.alert(
      '¡Paleta cargada!',
      `Color base ${palette.color_base} · ${HARMONY_LABELS[palette.esquema_tipo] ?? 'Personalizada'}`,
      [
        { text: 'Ir a Paleta', onPress: () => router.push('/') },
        { text: 'Cerrar', style: 'cancel' },
      ]
    );
  }

  // Ordenar paletas según el filtro activo
  const sortedPalettes = [...palettes].sort((a, b) => {
    if (sortBy === 'armonia') {
      return (a.esquema_tipo ?? '').localeCompare(b.esquema_tipo ?? '');
    }
    return new Date(b.creado_en ?? 0).getTime() - new Date(a.creado_en ?? 0).getTime();
  });

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.bg }, themeVars]} className="bg-background">
      <AppHeader />

      {/* ── Estados: cargando / error / contenido ── */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF8000" />
          <Text className="font-body-md text-[13px] text-secondary mt-4">Cargando tu archivo cromático...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
          <Text className="font-headline-sm text-[18px] text-ink-text font-bold text-center mt-4 mb-2">Error de conexión</Text>
          <Text className="font-body-md text-[13px] text-secondary text-center">{error}</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Encabezado editorial ── */}
          <Animated.View style={{ opacity: headerFade }} className="px-margin-mobile pt-8 mb-8">
            <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-widest mb-1">
              Archivo Personal
            </Text>
            <Text className="font-display-lg text-[38px] text-ink-text leading-none mb-2">
              {'Mis\nPaletas.'}
            </Text>
            {palettes.length > 0 && (
              <Text className="font-body-md text-[13px] text-secondary">
                {palettes.length} combinación{palettes.length !== 1 ? 'es' : ''} guardada{palettes.length !== 1 ? 's' : ''}
              </Text>
            )}
          </Animated.View>

          {palettes.length === 0 ? (
            <EmptyState fadeAnim={emptyFade} />
          ) : (
            <>
              {/* ── Filtros de ordenamiento ── */}
              <View className="flex-row gap-2 px-margin-mobile mb-6">
                {([
                  { id: 'reciente' as const, label: 'Más recientes', icon: 'time-outline' as const },
                  { id: 'armonia' as const, label: 'Por armonía', icon: 'git-branch-outline' as const },
                ]).map(({ id, label, icon }) => (
                  <TouchableOpacity
                    key={id}
                    onPress={() => setSortBy(id)}
                    className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${
                      sortBy === id
                        ? 'border-ink-text'
                        : 'border-border-subtle'
                    }`}
                    style={buttonStyle(colors, sortBy === id)}
                  >
                    <Ionicons name={icon} size={12} color={sortBy === id ? colors.buttonTextOnActive : colors.buttonTextMuted} />
                    <Text
                      className="font-label-caps text-[10px] uppercase tracking-wider"
                      style={buttonTextStyle(colors, sortBy === id)}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* ── Listado de tarjetas ── */}
              <View className="px-margin-mobile">
                {sortedPalettes.map((p, i) => (
                  <PaletteCard
                    key={p.id ?? i}
                    palette={p}
                    onLoad={handleLoad}
                    index={i}
                  />
                ))}
              </View>

              {/* ── Nota de pie ── */}
              <View className="px-margin-mobile mt-2 mb-4 flex-row items-start gap-2">
                <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} style={{ marginTop: 1 }} />
                <Text className="font-body-md text-[11px] text-secondary leading-relaxed flex-1">
                  Las paletas se guardan asociadas a tu sesión. Toca una tarjeta para cargarla en el motor de color.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

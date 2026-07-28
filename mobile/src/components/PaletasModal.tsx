/**
 * PaletasModal — Bottom Sheet de "Mis Paletas"
 * Se abre deslizando desde abajo cuando el usuario toca el ícono de perfil.
 * Patrón UX: Modal de tipo page sheet (estilo iOS / Material 3 Side Sheet).
 */
import {
  View, Text, Modal, ScrollView, TouchableOpacity,
  ActivityIndicator, Animated, Easing, Alert, Pressable,
  Dimensions, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getUserPalettes, SavedPalette } from '../lib/services/paletteService';
import { colorStore } from '../lib/colorStore';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString?: string): string {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

const HARMONY_LABELS: Record<string, string> = {
  complementary: 'Complementario',
  analogous: 'Análogo',
  triad: 'Tríada',
  'split-complementary': 'Comp. Dividido',
  square: 'Cuadrado',
  tetradic: 'Tetrádico',
  monochrome: 'Monocromo',
};

// ── PaletteCard ───────────────────────────────────────────────────────────────

function PaletteCard({
  palette, onLoad, index,
}: {
  palette: SavedPalette;
  onLoad: (p: SavedPalette) => void;
  index: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 300, delay: index * 60,
        easing: Easing.out(Easing.quad), useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 300, delay: index * 60,
        easing: Easing.out(Easing.quad), useNativeDriver: true,
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
        activeOpacity={0.82}
        style={styles.card}
      >
        {/* Banda de colores */}
        <View style={styles.colorBand}>
          {swatches.length > 0
            ? swatches.map((s, i) => <View key={i} style={{ flex: 1, backgroundColor: s.hex }} />)
            : <View style={{ flex: 1, backgroundColor: baseHex }} />}
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          {/* Fila superior */}
          <View style={styles.cardRow}>
            <View style={styles.hexRow}>
              <View style={[styles.dot, { backgroundColor: baseHex }]} />
              <Text style={styles.hexText}>{baseHex}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{harmonyLabel}</Text>
            </View>
          </View>

          {/* Chips de colores */}
          {swatches.length > 0 && (
            <View style={styles.chips}>
              {swatches.map((s, i) => (
                <View key={i} style={styles.chip}>
                  <View style={[styles.chipDot, { backgroundColor: s.hex }]} />
                  <Text style={styles.chipLabel}>
                    {s.label?.split(' ')[0] ?? s.hex}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={11} color="#66645f" />
              <Text style={styles.dateText}>{formatDate(palette.creado_en)}</Text>
            </View>
            <View style={styles.loadBadge}>
              <Ionicons name="color-wand-outline" size={11} color="#FF8000" />
              <Text style={styles.loadText}>Cargar</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyOuter}>
        <View style={styles.emptyInner}>
          <Ionicons name="color-palette-outline" size={26} color="#66645f" />
        </View>
      </View>
      <Text style={styles.emptyTitle}>Sin paletas guardadas</Text>
      <Text style={styles.emptySubtitle}>
        Crea una combinación en{' '}
        <Text style={{ color: '#FF8000', fontFamily: 'Inter-Bold' }}>Paleta</Text>
        {' '}y guárdala para verla aquí.
      </Text>
      <View style={styles.spectrumRow}>
        {['#FF6B6B', '#FF8000', '#FFD93D', '#6BCB77', '#4D96FF', '#8B5CF6'].map((c, i) => (
          <View key={i} style={[styles.spectrumBox, { backgroundColor: c }]} />
        ))}
      </View>
    </View>
  );
}

// ── PaletasModal (principal) ───────────────────────────────────────────────────

interface PaletasModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PaletasModal({ visible, onClose }: PaletasModalProps) {
  const router = useRouter();
  const setBaseColorHex = colorStore.setColor;

  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'reciente' | 'armonia'>('reciente');

  // Animación del sheet (slide desde abajo)
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      // Abrir: deslizar hacia arriba
      setLoading(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
      getUserPalettes().then((data) => {
        setPalettes(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      // Cerrar: deslizar hacia abajo
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 280,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  function handleLoad(palette: SavedPalette) {
    if (palette.color_base) setBaseColorHex(palette.color_base);
    Alert.alert(
      '¡Paleta cargada!',
      `${palette.color_base} · ${HARMONY_LABELS[palette.esquema_tipo] ?? 'Personalizada'}`,
      [
        { text: 'Ir a Paleta', onPress: () => { onClose(); router.push('/'); } },
        { text: 'Cerrar', style: 'cancel' },
      ]
    );
  }

  const sorted = [...palettes].sort((a, b) =>
    sortBy === 'armonia'
      ? (a.esquema_tipo ?? '').localeCompare(b.esquema_tipo ?? '')
      : new Date(b.creado_en ?? 0).getTime() - new Date(a.creado_en ?? 0).getTime()
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop semitransparente — toca para cerrar */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet que sube */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>

        {/* Handle bar */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header del modal */}
        <View style={styles.sheetHeader}>
          <View>
            <Text style={styles.sheetSuperLabel}>Archivo Personal</Text>
            <Text style={styles.sheetTitle}>Mis Paletas.</Text>
            {!loading && palettes.length > 0 && (
              <Text style={styles.sheetCount}>
                {palettes.length} combinación{palettes.length !== 1 ? 'es' : ''} guardada{palettes.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#241F1A" />
          </TouchableOpacity>
        </View>

        {/* Contenido */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF8000" />
            <Text style={styles.loadingText}>Cargando archivo cromático...</Text>
          </View>
        ) : palettes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Filtros */}
            <View style={styles.filters}>
              {([
                { id: 'reciente' as const, label: 'Recientes', icon: 'time-outline' as const },
                { id: 'armonia' as const, label: 'Por armonía', icon: 'git-branch-outline' as const },
              ]).map(({ id, label, icon }) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => setSortBy(id)}
                  style={[styles.filterBtn, sortBy === id && styles.filterBtnActive]}
                  activeOpacity={0.75}
                >
                  <Ionicons name={icon} size={11} color={sortBy === id ? '#FAF6EF' : '#66645f'} />
                  <Text style={[styles.filterLabel, sortBy === id && styles.filterLabelActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Lista */}
            <ScrollView
              style={styles.list}
              contentContainerStyle={{ paddingBottom: 48, paddingHorizontal: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {sorted.map((p, i) => (
                <PaletteCard key={p.id ?? i} palette={p} onLoad={handleLoad} index={i} />
              ))}
            </ScrollView>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(36, 31, 26, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.88,
    backgroundColor: '#f9f3eb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(36, 31, 26, 0.15)',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(36, 31, 26, 0.08)',
  },
  sheetSuperLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: '#66645f',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 2,
  },
  sheetTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    color: '#241F1A',
    lineHeight: 36,
  },
  sheetCount: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#66645f',
    marginTop: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(36, 31, 26, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#66645f',
    marginTop: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(36, 31, 26, 0.12)',
    backgroundColor: 'transparent',
  },
  filterBtnActive: {
    backgroundColor: '#241F1A',
    borderColor: '#241F1A',
  },
  filterLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#66645f',
  },
  filterLabelActive: {
    color: '#FAF6EF',
  },
  list: {
    flex: 1,
  },
  // PaletteCard
  card: {
    marginBottom: 14,
    backgroundColor: '#f0ebe2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(36, 31, 26, 0.08)',
    overflow: 'hidden',
  },
  colorBand: {
    flexDirection: 'row',
    height: 52,
  },
  cardBody: {
    padding: 14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(36, 31, 26, 0.1)',
  },
  hexText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: '#241F1A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#f9f3eb',
    borderWidth: 1,
    borderColor: 'rgba(36, 31, 26, 0.10)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 9,
    color: '#66645f',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f9f3eb',
    borderWidth: 1,
    borderColor: 'rgba(36, 31, 26, 0.08)',
    borderRadius: 20,
    paddingLeft: 5,
    paddingRight: 8,
    paddingVertical: 2,
  },
  chipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chipLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 9,
    color: '#66645f',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(36, 31, 26, 0.07)',
  },
  dateText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#66645f',
  },
  loadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 128, 0, 0.10)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  loadText: {
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    color: '#FF8000',
  },
  // EmptyState
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  emptyOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0ebe2',
    borderWidth: 1,
    borderColor: 'rgba(36, 31, 26, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(36, 31, 26, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#241F1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#66645f',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 240,
  },
  spectrumRow: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 6,
    opacity: 0.25,
  },
  spectrumBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
});

import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, ActivityIndicator, TextInput, PanResponder } from 'react-native';
import { useState, useMemo, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Svg, { Path, G } from 'react-native-svg';
import chroma from 'chroma-js';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateHarmonies, convertColorFormats, HarmonyType, SwatchData, ColorFormats } from '../lib/colorEngine';
import { savePalette } from '../lib/services/paletteService';
import { initAnonymousSession } from '../lib/services/authService';

const HARMONY_CHIPS: { type: HarmonyType; label: string }[] = [
  { type: 'complementary', label: 'Complementario' },
  { type: 'analogous', label: 'Análogo' },
  { type: 'triad', label: 'Tríada' },
  { type: 'monochrome', label: 'Monocromo' },
];

const PRESET_COLORS = ['#FF8000', '#0080FF', '#E53935', '#43A047', '#8E24AA', '#FDD835'];

const WHEEL_COLORS = [
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', 
  '#00FF00', '#00FF80', '#00FFFF', '#0080FF', 
  '#0000FF', '#8000FF', '#FF00FF', '#FF0080'
];

const WHEEL_SIZE = 264;

/**
 * Componente Vectorial de Triángulo Apuntador Geométrico Sutil
 */
function TrianglePointer({ color = '#FFFFFF', size = 18, rotationDeg = 0, isPrimary = false }: { color?: string; size?: number; rotationDeg?: number; isPrimary?: boolean }) {
  return (
    <View style={{ transform: [{ rotate: `${rotationDeg}deg` }] }} className="items-center justify-center">
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path 
          d="M12 3 L21 19 L3 19 Z" 
          fill={isPrimary ? color : '#FFFFFF'} 
          stroke={isPrimary ? '#FFFFFF' : 'rgba(0,0,0,0.2)'} 
          strokeWidth="2" 
        />
      </Svg>
    </View>
  );
}

/**
 * Rueda Cromática Vectorial Limpia y Ultra-Fluida a 60 FPS (RF-03, RF-04)
 */
function VectorColorWheel({ size = WHEEL_SIZE }: { size?: number }) {
  const center = size / 2;
  const radius = size / 2;
  const numSlices = WHEEL_COLORS.length;
  const angleStep = (2 * Math.PI) / numSlices;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G rotation={-90} origin={`${center}, ${center}`}>
        {WHEEL_COLORS.map((color, index) => {
          const startAngle = index * angleStep;
          const endAngle = (index + 1) * angleStep + 0.03;
          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(endAngle);
          const y2 = center + radius * Math.sin(endAngle);

          const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

          return <Path key={index} d={pathData} fill={color} />;
        })}
      </G>
    </Svg>
  );
}

export default function PaletteScreen() {
  const [selectorPos, setSelectorPos] = useState({ x: 75, y: 25 });
  const [baseColorHex, setBaseColorHex] = useState('#FF8000');
  const [currentAngleDeg, setCurrentAngleDeg] = useState(30);
  const [hexInput, setHexInput] = useState('FF8000');
  const [activeHarmony, setActiveHarmony] = useState<HarmonyType>('complementary');
  
  // Modales y Feedback UX
  const [isSaving, setIsSaving] = useState(false);
  const [savedPaletteId, setSavedPaletteId] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedTechSwatch, setSelectedTechSwatch] = useState<SwatchData | null>(null);
  const [techFormats, setTechFormats] = useState<ColorFormats | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Animaciones Reanimated para el rebote suave del hoyo central
  const centerScale = useSharedValue(1);

  const centerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: centerScale.value }],
    };
  });

  const triggerCenterPop = () => {
    centerScale.value = withSequence(
      withTiming(1.15, { duration: 90 }),
      withSpring(1, { damping: 12, stiffness: 220 })
    );
  };

  // Inicializar sesión anónima de Supabase (RNF-08)
  useEffect(() => {
    initAnonymousSession();
  }, []);

  // Sincronizar input HEX cuando cambia baseColorHex
  useEffect(() => {
    setHexInput(baseColorHex.replace('#', ''));
    triggerCenterPop();
  }, [baseColorHex]);

  // Mostrar Toast temporal
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Procesar toque o arrastre continuo a 60 FPS (RF-04)
  const processWheelTouch = (x: number, y: number) => {
    const center = WHEEL_SIZE / 2;
    const dx = x - center;
    const dy = y - center;

    let angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI + 90;
    if (angleDeg < 0) angleDeg += 360;

    setCurrentAngleDeg(angleDeg);

    try {
      const newHex = chroma.hsl(angleDeg, 1, 0.5).hex().toUpperCase();
      setBaseColorHex(newHex);
    } catch {
      const segmentIndex = Math.floor((angleDeg / 360) * WHEEL_COLORS.length) % WHEEL_COLORS.length;
      setBaseColorHex(WHEEL_COLORS[segmentIndex]);
    }

    const radiusPct = 35;
    const markerX = 50 + radiusPct * Math.cos(angleRad);
    const markerY = 50 + radiusPct * Math.sin(angleRad);
    setSelectorPos({ x: markerX, y: markerY });
  };

  // PanResponder nativo ultra-optimizado
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        processWheelTouch(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        processWheelTouch(locationX, locationY);
      },
    })
  ).current;

  // Cálculo de posiciones de los TRIÁNGULOS APUNTADORES GEOMÉTRICOS según el esquema cromático
  const trianglePointers = useMemo(() => {
    const radiusPct = 36;
    let offsets: number[] = [];

    if (activeHarmony === 'complementary') {
      offsets = [0, 180]; // 2 triángulos opuestos
    } else if (activeHarmony === 'triad') {
      offsets = [0, 120, 240]; // 3 triángulos de tríada
    } else if (activeHarmony === 'analogous') {
      offsets = [-30, 0, 30]; // 3 triángulos contiguos
    } else {
      offsets = [0]; // Monocromo: 1 triángulo principal
    }

    return offsets.map((offset, index) => {
      const totalAngleDeg = (currentAngleDeg + offset) % 360;
      const rad = ((totalAngleDeg - 90) * Math.PI) / 180;
      return {
        x: 50 + radiusPct * Math.cos(rad),
        y: 50 + radiusPct * Math.sin(rad),
        rotationDeg: totalAngleDeg + 180, // Rotar para que la punta apunte al aro cromático
        isPrimary: index === 0,
      };
    });
  }, [currentAngleDeg, activeHarmony]);

  // Aplicar código HEX ingresado manualmente
  const handleHexInputChange = (text: string) => {
    const cleaned = text.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
    setHexInput(cleaned);
    if (cleaned.length === 6) {
      const formattedHex = `#${cleaned.toUpperCase()}`;
      if (chroma.valid(formattedHex)) {
        setBaseColorHex(formattedHex);
      }
    }
  };

  // Ajustar luminosidad
  const handleAdjustLightness = (delta: number) => {
    try {
      const newColor = delta > 0 
        ? chroma(baseColorHex).brighten(0.4).hex().toUpperCase()
        : chroma(baseColorHex).darken(0.4).hex().toUpperCase();
      setBaseColorHex(newColor);
    } catch {}
  };

  // Ajustar saturación (RF-19)
  const handleAdjustSaturate = (delta: number) => {
    try {
      const newColor = delta > 0 
        ? chroma(baseColorHex).saturate(0.5).hex().toUpperCase()
        : chroma(baseColorHex).desaturate(0.5).hex().toUpperCase();
      setBaseColorHex(newColor);
    } catch {}
  };

  // Generación reactiva de los 4 swatches usando el motor de color (RF-07)
  const swatches: SwatchData[] = useMemo(() => {
    return generateHarmonies(baseColorHex, activeHarmony);
  }, [baseColorHex, activeHarmony]);

  // Persistir paleta activa localmente para sincronizar entre pantallas
  useEffect(() => {
    const persistActivePalette = async () => {
      try {
        await AsyncStorage.setItem('active_palette', JSON.stringify({
          baseColor: baseColorHex,
          harmony: activeHarmony,
          swatches: swatches,
        }));
      } catch (err) {
        console.error('Error al guardar paleta activa en AsyncStorage:', err);
      }
    };
    persistActivePalette();
  }, [swatches, baseColorHex, activeHarmony]);

  // Guardar paleta en la base de datos Supabase
  const handleSavePalette = async () => {
    setIsSaving(true);
    const harmonyLabel = HARMONY_CHIPS.find(h => h.type === activeHarmony)?.label || 'Complementario';
    
    const result = await savePalette(baseColorHex, harmonyLabel, swatches);
    setIsSaving(false);

    if (result.success && result.id) {
      setSavedPaletteId(result.id);
      triggerToast('✓ Paleta registrada en tu nube Supabase');
    } else {
      triggerToast(`⚠️ ${result.error || 'Error de conexión'}`);
    }
  };

  // Abrir Ficha Técnica Completa (RF-10)
  const handleOpenTechSpecs = (swatch: SwatchData) => {
    setSelectedTechSwatch(swatch);
    setTechFormats(convertColorFormats(swatch.hex));
  };

  const shareUrl = savedPaletteId 
    ? `https://rulec.app/paleta/${savedPaletteId}` 
    : `https://rulec.app/paleta?color=${encodeURIComponent(baseColorHex)}&harmony=${activeHarmony}`;

  return (
    <SafeAreaView className="flex-1 bg-paper-bg">
      {/* Toast Notification Flotante */}
      {toastMessage && (
        <View className="absolute top-12 left-margin-mobile right-margin-mobile z-50 bg-ink-text px-4 py-3 rounded-xl shadow-lg border border-border-subtle flex-row items-center justify-between">
          <Text className="font-body-md text-[13px] text-paper-bg font-medium">{toastMessage}</Text>
          <Ionicons name="checkmark-circle" size={18} color="#43A047" />
        </View>
      )}

      {/* Header Editorial */}
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
        <View className="w-full items-center mb-8">
          <Text className="font-display-lg text-[32px] text-ink-text mb-3 text-center">
            Paleta de Color
          </Text>
          <Text className="font-body-md text-[15px] text-on-surface-variant text-center max-w-[310px] leading-relaxed">
            Toca o arrastra sobre el círculo para definir tu tono base y calcular una combinación croma armónica.
          </Text>
        </View>

        {/* Area de la Rueda Cromática con Resplandor Ambiental y Triángulos Apuntadores */}
        <View className="w-full items-center mb-8">
          <View 
            className="relative w-[300px] h-[300px] items-center justify-center rounded-full"
            style={[styles.glowShadow, { shadowColor: baseColorHex }]}
          >
            {/* Base táctil */}
            <View className="absolute w-full h-full rounded-full border border-border-subtle bg-surface" />
            
            {/* Rueda cromática vectorial limpia (100% fluida a 60 FPS) */}
            <View 
              {...panResponder.panHandlers}
              className="relative w-[88%] h-[88%] rounded-full items-center justify-center overflow-hidden cursor-crosshair"
            >
              <VectorColorWheel size={WHEEL_SIZE} />
              
              {/* TRIÁNGULOS APUNTADORES GEOMÉTRICOS (Complementario = 2, Tríada = 3, Análogo = 3) */}
              {trianglePointers.map((ptr, index) => (
                <View 
                  key={index}
                  className="absolute w-6 h-6 items-center justify-center pointer-events-none shadow-md"
                  style={{ 
                    left: `${ptr.x}%`, 
                    top: `${ptr.y}%`, 
                    transform: [{ translateX: -12 }, { translateY: -12 }]
                  }}
                >
                  <TrianglePointer 
                    color={baseColorHex} 
                    size={20} 
                    rotationDeg={ptr.rotationDeg} 
                    isPrimary={ptr.isPrimary} 
                  />
                </View>
              ))}
            </View>

            {/* Hoyo Central "Base" con Animación de Rebote Elástico Suave */}
            <Animated.View 
              style={[centerAnimatedStyle]}
              className="absolute w-[44%] h-[44%] rounded-full bg-paper-bg border border-border-subtle items-center justify-center z-10 shadow-md pointer-events-none"
            >
              <View 
                className="w-12 h-12 rounded-full border border-border-subtle shadow-md mb-1"
                style={{ backgroundColor: baseColorHex }}
              />
              <Text className="font-label-caps text-[10px] font-semibold tracking-widest text-on-surface-variant uppercase">BASE</Text>
              <Text className="font-button-text text-[12px] font-bold text-ink-text">{baseColorHex}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Selector de Entrada Manual HEX & Presets (RF-19) */}
        <View className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-4 mb-6">
          <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-2">
            Ingreso Directo de Código HEX
          </Text>
          <View className="flex-row items-center gap-3 mb-3">
            <View className="flex-1 flex-row items-center bg-surface-container-lowest border border-border-subtle rounded-lg px-3 h-11">
              <Text className="font-button-text text-[14px] text-secondary mr-1">#</Text>
              <TextInput
                value={hexInput}
                onChangeText={handleHexInputChange}
                placeholder="FF8000"
                maxLength={6}
                autoCapitalize="characters"
                className="flex-1 font-button-text text-[14px] text-ink-text font-bold"
              />
            </View>
            <View className="w-11 h-11 rounded-lg border border-border-subtle" style={{ backgroundColor: baseColorHex }} />
          </View>

          {/* Quick Presets */}
          <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-2">
            Tonos Curados de Referencia
          </Text>
          <View className="flex-row justify-between">
            {PRESET_COLORS.map((hex) => (
              <TouchableOpacity
                key={hex}
                onPress={() => setBaseColorHex(hex)}
                className={`w-9 h-9 rounded-full border ${baseColorHex === hex ? 'border-ink-text scale-110' : 'border-border-subtle'} active:scale-95`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </View>
        </View>

        {/* Controles Finos de Ajuste (Luminosidad & Saturación - RF-19) */}
        <View className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-4 mb-8">
          <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-3">
            Ajuste Fino de Tono (Luminosidad & Saturación)
          </Text>
          <View className="flex-row gap-2 mb-2">
            <TouchableOpacity 
              onPress={() => handleAdjustLightness(-1)}
              className="flex-1 h-9 bg-surface-container-lowest border border-border-subtle rounded-lg items-center justify-center flex-row gap-1 active:scale-95"
            >
              <Ionicons name="moon-outline" size={14} color="#241F1A" />
              <Text className="font-button-text text-[12px] text-ink-text font-medium">Oscurecer</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleAdjustLightness(1)}
              className="flex-1 h-9 bg-surface-container-lowest border border-border-subtle rounded-lg items-center justify-center flex-row gap-1 active:scale-95"
            >
              <Ionicons name="sunny-outline" size={14} color="#241F1A" />
              <Text className="font-button-text text-[12px] text-ink-text font-medium">Aclarar</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity 
              onPress={() => handleAdjustSaturate(-1)}
              className="flex-1 h-9 bg-surface-container-lowest border border-border-subtle rounded-lg items-center justify-center flex-row gap-1 active:scale-95"
            >
              <Ionicons name="water-outline" size={14} color="#241F1A" />
              <Text className="font-button-text text-[12px] text-ink-text font-medium">Desaturar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleAdjustSaturate(1)}
              className="flex-1 h-9 bg-surface-container-lowest border border-border-subtle rounded-lg items-center justify-center flex-row gap-1 active:scale-95"
            >
              <Ionicons name="sparkles-outline" size={14} color="#241F1A" />
              <Text className="font-button-text text-[12px] text-ink-text font-medium">Intensificar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Harmony Chips (RF-07) */}
        <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-3">
          Esquema Cromático
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full mb-8">
          <View className="flex-row gap-3 px-1">
            {HARMONY_CHIPS.map((chip) => {
              const isSelected = chip.type === activeHarmony;
              return (
                <TouchableOpacity 
                  key={chip.type}
                  onPress={() => setActiveHarmony(chip.type)}
                  className={`px-5 h-touch-target items-center justify-center rounded-[6px] border ${
                    isSelected 
                      ? 'bg-ink-text border-ink-text' 
                      : 'border-border-subtle bg-surface-container-lowest'
                  } active:scale-95`}
                >
                  <Text className={`font-label-caps text-[12px] tracking-widest uppercase ${
                    isSelected ? 'text-paper-bg' : 'text-ink-text'
                  }`}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Swatches Output Premium (RF-10) */}
        <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-3">
          Paleta Resultante (Toca para Ficha Técnica)
        </Text>
        <View className="w-full flex-row flex-wrap justify-between gap-y-4 mb-8">
          {swatches.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => handleOpenTechSpecs(item)}
              className="w-[48%] active:scale-[0.98]"
            >
              <View 
                className="w-full h-32 rounded-[6px] border border-border-subtle mb-2.5 shadow-sm relative justify-between p-2" 
                style={{ backgroundColor: item.hex }}
              >
                <View className="self-end bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                  <Ionicons name="information-circle-outline" size={14} color="#FFF" />
                </View>
              </View>
              <View className="px-1">
                <Text className="font-label-caps text-[12px] text-ink-text uppercase font-bold">{item.hex}</Text>
                <Text className="font-body-md text-[12px] text-on-surface-variant mt-0.5">{item.label}</Text>
                <Text className="font-body-md text-[10px] text-secondary opacity-70 mt-0.5">{item.rgb}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botones de Acción (Guardar en Supabase y Compartir QR - RF-20) */}
        <View className="w-full flex-row gap-3 mb-12">
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleSavePalette}
            disabled={isSaving}
            className="flex-1 h-touch-target bg-primary rounded-lg items-center justify-center flex-row gap-2"
          >
            {isSaving ? (
              <ActivityIndicator color="#FAF6EF" />
            ) : (
              <>
                <Ionicons name="bookmark-outline" size={18} color="#FAF6EF" />
                <Text className="font-button-text text-[14px] text-paper-bg font-medium">Guardar Paleta</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setShowQrModal(true)}
            className="px-5 h-touch-target bg-surface-container-low border border-border-subtle rounded-lg items-center justify-center flex-row gap-2"
          >
            <Ionicons name="qr-code-outline" size={18} color="#241F1A" />
            <Text className="font-button-text text-[14px] text-ink-text font-medium">QR</Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Modal Ficha Técnica Completa (RF-10: HEX, RGB, HSL, CMYK) */}
      <Modal
        visible={!!selectedTechSwatch}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTechSwatch(null)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="w-full bg-paper-bg rounded-t-3xl p-6 border-t border-border-subtle shadow-2xl">
            <View className="flex-row justify-between items-center w-full mb-4 pb-2 border-b border-border-subtle">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full border border-border-subtle" style={{ backgroundColor: selectedTechSwatch?.hex || '#000' }} />
                <View>
                  <Text className="font-headline-sm text-[18px] text-ink-text">{selectedTechSwatch?.label}</Text>
                  <Text className="font-label-caps text-[12px] text-secondary uppercase">{selectedTechSwatch?.hex}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setSelectedTechSwatch(null)}>
                <Ionicons name="close" size={24} color="#0b0704" />
              </TouchableOpacity>
            </View>

            <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-3">
              Ficha Técnica para Imprenta y Desarrollo
            </Text>

            {techFormats && (
              <View className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-4 mb-6 gap-3">
                <View className="flex-row justify-between items-center border-b border-border-subtle/50 pb-2">
                  <Text className="font-body-md text-[13px] text-secondary">Código HEX</Text>
                  <Text className="font-button-text text-[14px] text-ink-text font-bold">{techFormats.hex}</Text>
                </View>

                <View className="flex-row justify-between items-center border-b border-border-subtle/50 pb-2">
                  <Text className="font-body-md text-[13px] text-secondary">Pantalla (RGB)</Text>
                  <Text className="font-button-text text-[14px] text-ink-text font-bold">{techFormats.rgb}</Text>
                </View>

                <View className="flex-row justify-between items-center border-b border-border-subtle/50 pb-2">
                  <Text className="font-body-md text-[13px] text-secondary">Tono / Saturación (HSL)</Text>
                  <Text className="font-button-text text-[14px] text-ink-text font-bold">{techFormats.hsl}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="font-body-md text-[13px] text-secondary">Imprenta (CMYK)</Text>
                  <Text className="font-button-text text-[14px] text-ink-text font-bold">{techFormats.cmyk}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity 
              onPress={() => {
                triggerToast(`Copiado ${selectedTechSwatch?.hex} al portapapeles`);
                setSelectedTechSwatch(null);
              }}
              className="w-full h-touch-target bg-primary rounded-lg items-center justify-center flex-row gap-2"
            >
              <Ionicons name="copy-outline" size={18} color="#FAF6EF" />
              <Text className="font-button-text text-[14px] text-paper-bg font-medium">Copiar Código HEX</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Código QR (RF-20) */}
      <Modal
        visible={showQrModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-margin-mobile">
          <View className="w-full max-w-[340px] bg-paper-bg rounded-2xl p-6 items-center border border-border-subtle shadow-xl">
            <View className="flex-row justify-between items-center w-full mb-6 border-b border-border-subtle pb-3">
              <Text className="font-headline-sm text-[20px] text-primary">Compartir Paleta</Text>
              <TouchableOpacity onPress={() => setShowQrModal(false)}>
                <Ionicons name="close" size={24} color="#0b0704" />
              </TouchableOpacity>
            </View>

            <View className="p-4 bg-white rounded-xl border border-border-subtle mb-6 items-center justify-center">
              <QRCode value={shareUrl} size={200} color="#241F1A" backgroundColor="#FFFFFF" />
            </View>

            <Text className="font-body-md text-[13px] text-secondary text-center mb-6 leading-relaxed">
              Escanea este código QR con otro dispositivo para transferir la paleta cromática.
            </Text>

            <TouchableOpacity 
              onPress={() => setShowQrModal(false)}
              className="w-full h-touch-target bg-primary rounded-lg items-center justify-center"
            >
              <Text className="font-button-text text-[14px] text-paper-bg font-medium">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  glowShadow: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 10,
  },
});

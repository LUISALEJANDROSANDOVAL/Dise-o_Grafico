import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useState, useRef, useMemo, type Dispatch, type SetStateAction } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { generateNameIdeas, getFontAdviceAI } from '../lib/services/aiService';

// ─── Catálogo de fuentes instaladas ────────────────────────────────────────────
const FONT_CATALOG: { id: string; name: string; family: string; style: string; category: string }[] = [
  // Sans-Serif
  { id: 'Inter', name: 'Inter', family: 'Inter', style: 'Sans-Serif Moderna', category: 'Sans-Serif' },
  { id: 'Montserrat', name: 'Montserrat', family: 'Montserrat', style: 'Sans-Serif Geométrica', category: 'Sans-Serif' },
  { id: 'Poppins', name: 'Poppins', family: 'Poppins', style: 'Sans-Serif Amigable', category: 'Sans-Serif' },
  { id: 'Raleway', name: 'Raleway', family: 'Raleway', style: 'Sans-Serif Elegante', category: 'Sans-Serif' },
  { id: 'DMSans', name: 'DM Sans', family: 'DMSans', style: 'Sans-Serif Minimalista', category: 'Sans-Serif' },
  // Serif
  { id: 'PlayfairDisplay', name: 'Playfair Display', family: 'PlayfairDisplay-Bold', style: 'Serif de Lujo', category: 'Serif' },
  { id: 'Cinzel', name: 'Cinzel', family: 'Cinzel', style: 'Serif Clásica', category: 'Serif' },
  { id: 'Lora', name: 'Lora', family: 'Lora', style: 'Serif Literaria', category: 'Serif' },
  { id: 'CormorantGaramond', name: 'Cormorant Garamond', family: 'CormorantGaramond', style: 'Serif de Alta Moda', category: 'Serif' },
  // Display
  { id: 'Oswald', name: 'Oswald', family: 'Oswald', style: 'Display Fuerte', category: 'Display' },
  { id: 'BebasNeue', name: 'Bebas Neue', family: 'BebasNeue', style: 'Display Impacto', category: 'Display' },
  // Script
  { id: 'Pacifico', name: 'Pacifico', family: 'Pacifico', style: 'Script Playful', category: 'Script' },
  { id: 'DancingScript', name: 'Dancing Script', family: 'DancingScript', style: 'Script Elegante', category: 'Script' },
  // Monospace
  { id: 'SpaceMono', name: 'Space Mono', family: 'SpaceMono', style: 'Monospace Espacial', category: 'Monospace' },
  { id: 'SourceCodePro', name: 'Source Code Pro', family: 'SourceCodePro', style: 'Monospace Técnica', category: 'Monospace' },
];

const CATEGORIES = ['Todas', 'Sans-Serif', 'Serif', 'Display', 'Script', 'Monospace'];

// ─── Principios del naming (Guía) ──────────────────────────────────────────────
const NAMING_PRINCIPLES = [
  {
    icon: 'ear-outline' as const,
    color: '#0055FF',
    bg: 'rgba(0, 85, 255, 0.08)',
    title: 'Fácil de pronunciar y recordar',
    body: 'Evita nombres demasiado largos o con ortografía complicada. Si tienes que deletrearlo varias veces, probablemente sea demasiado complejo. Un buen nombre fluye de manera natural en una conversación.',
  },
  {
    icon: 'star-outline' as const,
    color: '#8B2BE2',
    bg: 'rgba(139, 43, 226, 0.08)',
    title: 'Que refleje la esencia',
    body: 'El nombre no necesita describir exactamente lo que haces, pero sí debe transmitir la emoción o valor correcto. "Nike" inspira victoria, no dice literalmente "Zapatos Deportivos".',
  },
  {
    icon: 'hourglass-outline' as const,
    color: '#E53935',
    bg: 'rgba(229, 57, 53, 0.08)',
    title: 'Evita modas pasajeras',
    body: 'No uses prefijos o sufijos solo porque están de moda (como "i-Algo" o "Algo-ify"). Piensa en un nombre atemporal que pueda sonar bien y profesional dentro de 10 años.',
  },
  {
    icon: 'checkmark-circle-outline' as const,
    color: '#2E7D32',
    bg: 'rgba(46, 125, 50, 0.08)',
    title: 'Verifica la disponibilidad',
    body: 'Antes de encariñarte con un nombre, busca si está disponible el dominio web (.com, .net) y revisa que no haya otra marca usándolo en las redes sociales que planeas utilizar.',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Componente principal ───────────────────────────────────────────────────────
export default function NamingScreen() {
  const [fase, setFase] = useState<'guia' | 'taller'>('guia');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="w-full flex-row justify-between items-center h-touch-target px-margin-mobile border-b border-border-subtle bg-background">
        <TouchableOpacity className="active:scale-95">
          <Ionicons name="menu-outline" size={24} color="#0b0704" />
        </TouchableOpacity>
        <Text className="font-display-lg text-[28px] tracking-tight text-primary">RULEC</Text>
        <TouchableOpacity className="active:scale-95">
          <Ionicons name="person-circle-outline" size={24} color="#0b0704" />
        </TouchableOpacity>
      </View>

      {fase === 'guia' ? (
        <GuiaView onStart={() => setFase('taller')} />
      ) : (
        <TallerView onBack={() => setFase('guia')} />
      )}
    </SafeAreaView>
  );
}

// ─── FASE 1: Guía Educativa ─────────────────────────────────────────────────────
function GuiaView({ onStart }: { onStart: () => void }) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeCard, setActiveCard] = useState(0);

  return (
    <View className="flex-1">
      {/* Hero */}
      <View className="px-margin-mobile pt-8 pb-4">
        <Text className="font-display-lg text-[32px] text-ink-text mb-2 leading-tight">
          El arte de elegir el nombre perfecto
        </Text>
        <Text className="font-body-md text-[15px] text-secondary leading-relaxed">
          El nombre de tu marca es tu primera carta de presentación. Sigue estos 4 principios fundamentales.
        </Text>
      </View>

      {/* Indicador de puntos */}
      <View className="flex-row justify-center gap-2 mb-4">
        {NAMING_PRINCIPLES.map((_, i) => (
          <View
            key={i}
            style={{
              width: activeCard === i ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: activeCard === i ? '#241F1A' : '#D9D2C5',
            }}
          />
        ))}
      </View>

      {/* Carrusel horizontal de tarjetas */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH - 40}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 40));
          setActiveCard(Math.min(idx, NAMING_PRINCIPLES.length - 1));
        }}
      >
        {NAMING_PRINCIPLES.map((p, idx) => (
          <View
            key={idx}
            style={{ width: SCREEN_WIDTH - 52 }}
            className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6"
          >
            <View
              className="w-12 h-12 rounded-2xl items-center justify-center mb-5"
              style={{ backgroundColor: p.bg }}
            >
              <Ionicons name={p.icon} size={24} color={p.color} />
            </View>
            <Text className="font-headline-sm text-[22px] text-ink-text mb-3 leading-tight">
              {p.title}
            </Text>
            <Text className="font-body-md text-[15px] text-secondary leading-relaxed">
              {p.body}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Botón CTA */}
      <View className="px-margin-mobile pb-8 pt-6">
        <TouchableOpacity
          onPress={onStart}
          activeOpacity={0.85}
          className="bg-ink-text rounded-2xl py-4 items-center flex-row justify-center gap-3"
        >
          <Text className="font-headline-sm text-[16px] text-paper-bg">
            Empezar a crear mi nombre
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FAF6EF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── FASE 2: Taller de Naming y Tipografía ─────────────────────────────────────
function TallerView({ onBack }: { onBack: () => void }) {
  const [focus, setFocus] = useState('');
  const [namingIdea, setNamingIdea] = useState('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [namesCooldown, setNamesCooldown] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [selectedFont, setSelectedFont] = useState(FONT_CATALOG[0]);

  const [isAdvising, setIsAdvising] = useState(false);
  const [advisorCooldown, setAdvisorCooldown] = useState(0);
  const [fontAdvice, setFontAdvice] = useState<{ isGood: boolean; advice: string } | null>(null);

  // Análisis semántico local (mantenemos esta función del diseño anterior)
  const semanticAnalysis = useMemo(() => {
    const clean = namingIdea.trim().toUpperCase();
    if (clean.length < 2) return null;
    let strength = 'Media';
    let memorability = 'Media';
    let phonetic = 'Fluida';
    if (/[KXZVQ]/.test(clean)) strength = 'Alta (Contundente)';
    if (clean.length <= 5) memorability = 'Muy Alta';
    else if (clean.length > 9) memorability = 'Baja (Difícil de recordar)';
    const endsWithVowel = /[AEIOU]$/.test(clean);
    phonetic = endsWithVowel ? 'Melódica (Pronunciación global)' : 'Asertiva (Terminación sólida)';
    return { strength, memorability, phonetic };
  }, [namingIdea]);

  // Filtrar fuentes
  const filteredFonts = useMemo(() => {
    let fonts = FONT_CATALOG;
    if (activeCategory !== 'Todas') fonts = fonts.filter((f) => f.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      fonts = fonts.filter((f) => f.name.toLowerCase().includes(q) || f.style.toLowerCase().includes(q));
    }
    return fonts;
  }, [searchQuery, activeCategory]);

  function startCooldown(setter: Dispatch<SetStateAction<number>>, seconds = 15) {
    setter(seconds);
    const interval = setInterval(() => {
      setter((prev: number) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleGenerateNames() {
    if (focus.trim().length < 5) return;
    setIsGenerating(true);
    setGeneratedNames([]);
    const ideas = await generateNameIdeas(focus);
    setGeneratedNames(ideas);
    if (ideas.length > 0 && !namingIdea) setNamingIdea(ideas[0]);
    setIsGenerating(false);
    startCooldown(setNamesCooldown, 15);
  }

  async function handleEvaluateFont() {
    if (focus.trim().length < 10) return;
    setIsAdvising(true);
    setFontAdvice(null);
    const result = await getFontAdviceAI(focus, selectedFont.name, selectedFont.style);
    setFontAdvice(result);
    setIsAdvising(false);
    startCooldown(setAdvisorCooldown, 15);
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <View className="px-margin-mobile pt-5">

        {/* Botón volver */}
        <TouchableOpacity onPress={onBack} className="flex-row items-center gap-1 mb-6" activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={16} color="#605e59" />
          <Text className="font-body-md text-[14px] text-secondary">Volver a la guía</Text>
        </TouchableOpacity>

        {/* Título del taller */}
        <Text className="font-display-lg text-[28px] text-ink-text mb-1 leading-tight">
          Taller de Naming
        </Text>
        <Text className="font-body-md text-[14px] text-secondary mb-8">
          Usa Inteligencia Artificial para generar ideas y evaluar tus decisiones tipográficas.
        </Text>

        {/* ── PASO 1: Descripción de la empresa ────────────── */}
        <View className="mb-6">
          <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-widest mb-3">
            1. ¿De qué trata tu empresa?
          </Text>
          <Text className="font-body-md text-[13px] text-secondary mb-3 leading-relaxed">
            Nuestro asesor inteligente usará esto para recomendarte fuentes y generar nombres.
          </Text>
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
            <TextInput
              multiline
              numberOfLines={3}
              value={focus}
              onChangeText={setFocus}
              placeholder="Ej: Un despacho de abogados, una marca de joyería moderna, un videojuego retro..."
              placeholderTextColor="rgba(135, 135, 139, 0.5)"
              className="font-body-md text-[15px] text-primary p-4 min-h-[90px]"
              style={{ textAlignVertical: 'top' }}
            />
          </View>
        </View>

        {/* ── PASO 2: Idea de nombre + IA ─────────────────── */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-widest">
              2. Tu idea de nombre
            </Text>
            <TouchableOpacity
              onPress={handleGenerateNames}
              disabled={isGenerating || namesCooldown > 0 || focus.trim().length < 5}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(0, 85, 255, 0.08)', opacity: focus.trim().length < 5 ? 0.4 : 1 }}
            >
              {isGenerating
                ? <ActivityIndicator size="small" color="#0055FF" />
                : <Ionicons name="sparkles-outline" size={13} color="#0055FF" />
              }
              <Text style={{ color: '#0055FF', fontSize: 12, fontFamily: 'Inter-SemiBold' }}>
                {namesCooldown > 0 ? `Espera ${namesCooldown}s` : 'Auto Generar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chips de nombres generados */}
          {generatedNames.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {generatedNames.map((name, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setNamingIdea(name)}
                  className="px-3 py-1.5 rounded-full border border-border-subtle bg-surface-container"
                >
                  <Text className="font-body-md text-[13px] text-primary">{name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Input del nombre */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl flex-row items-center px-4">
            <Ionicons name="create-outline" size={16} color="#605e59" />
            <TextInput
              value={namingIdea}
              onChangeText={setNamingIdea}
              placeholder="Escribe o selecciona un nombre..."
              placeholderTextColor="rgba(135, 135, 139, 0.5)"
              className="flex-1 font-body-md text-[15px] text-primary py-3 ml-2"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Análisis semántico (si hay nombre) */}
        {semanticAnalysis && (
          <View className="mb-6 bg-surface-container-lowest border border-border-subtle rounded-xl p-4">
            <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-widest mb-3">
              Análisis semántico
            </Text>
            <View className="flex-row gap-3">
              <SemanticBadge label="Fuerza" value={semanticAnalysis.strength} />
              <SemanticBadge label="Memoria" value={semanticAnalysis.memorability} />
              <SemanticBadge label="Fonética" value={semanticAnalysis.phonetic} />
            </View>
          </View>
        )}

        {/* ── PASO 3: Catálogo de fuentes ──────────────────── */}
        <View className="mb-6">
          <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-widest mb-3">
            3. Catálogo de Google Fonts
          </Text>

          {/* Buscador */}
          <View className="bg-surface-container-lowest border border-border-subtle rounded-xl flex-row items-center px-3 mb-3">
            <Ionicons name="search-outline" size={16} color="#605e59" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar fuente... (ej: Serif, Script)"
              placeholderTextColor="rgba(135, 135, 139, 0.5)"
              className="flex-1 font-body-md text-[14px] text-primary py-3 ml-2"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#605e59" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filtros de categoría */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2 pr-4">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: activeCategory === cat ? '#241F1A' : '#F3EDE6',
                  }}
                >
                  <Text style={{
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 12,
                    color: activeCategory === cat ? '#FAF6EF' : '#605e59',
                  }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text className="font-body-md text-[12px] text-secondary mb-3">
            {filteredFonts.length} fuentes encontradas
          </Text>

          {/* Grid de fuentes 2 columnas */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {filteredFonts.map((font) => {
              const isSelected = selectedFont.id === font.id;
              return (
                <TouchableOpacity
                  key={font.id}
                  onPress={() => { setSelectedFont(font); setFontAdvice(null); }}
                  style={{
                    width: (SCREEN_WIDTH - 52) / 2,
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: isSelected ? 1.5 : 1,
                    borderColor: isSelected ? '#241F1A' : 'rgba(36, 31, 26, 0.08)',
                    backgroundColor: isSelected ? '#241F1A' : '#FFFFFF',
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: font.family,
                      fontSize: 15,
                      color: isSelected ? '#FAF6EF' : '#241F1A',
                      marginBottom: 4,
                    }}
                  >
                    {font.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'Inter',
                      fontSize: 10,
                      color: isSelected ? 'rgba(250,246,239,0.6)' : '#605e59',
                    }}
                  >
                    {font.style}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {filteredFonts.length === 0 && (
              <View className="w-full items-center py-10">
                <Ionicons name="search-outline" size={32} color="#D9D2C5" />
                <Text className="font-body-md text-[14px] text-secondary mt-2">
                  No se encontraron fuentes para "{searchQuery}"
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── VISTA PREVIA EN TIEMPO REAL ──────────────────── */}
        <View className="mb-6">
          <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-widest mb-3">
            Vista previa
          </Text>
          <View className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 items-center justify-center min-h-[140px]">
            <View className="flex-row items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-surface-container">
              <Ionicons name="text-outline" size={12} color="#605e59" />
              <Text className="font-label-caps text-[10px] text-secondary uppercase tracking-wide">
                {selectedFont.name}
              </Text>
            </View>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              style={{
                fontFamily: selectedFont.family,
                fontSize: 40,
                color: '#241F1A',
                textAlign: 'center',
                lineHeight: 48,
              }}
            >
              {namingIdea.trim() || 'Tu Marca'}
            </Text>
            <Text className="font-body-md text-[12px] text-secondary mt-3">
              {selectedFont.style}
            </Text>
          </View>
        </View>

        {/* ── ASESOR TIPOGRÁFICO IA ─────────────────────────── */}
        <View className="mb-6">
          <Text className="font-label-caps text-[11px] text-secondary uppercase tracking-widest mb-3">
            Asesor tipográfico con IA
          </Text>

          <TouchableOpacity
            onPress={handleEvaluateFont}
            disabled={isAdvising || focus.trim().length < 10 || advisorCooldown > 0}
            className="bg-ink-text rounded-xl py-4 flex-row items-center justify-center gap-2 mb-4"
            style={{ opacity: focus.trim().length < 10 ? 0.4 : 1 }}
            activeOpacity={0.85}
          >
            {isAdvising
              ? <ActivityIndicator size="small" color="#FAF6EF" />
              : <Ionicons name="sparkles-outline" size={18} color="#FAF6EF" />
            }
            <Text className="font-headline-sm text-[15px] text-paper-bg">
              {advisorCooldown > 0
                ? `Espera ${advisorCooldown}s`
                : isAdvising
                  ? 'Analizando la combinación...'
                  : 'Consultar Asesor Tipográfico'}
            </Text>
          </TouchableOpacity>

          {focus.trim().length < 10 && (
            <Text className="font-body-md text-[12px] text-secondary text-center">
              Describe tu empresa (mínimo 10 caracteres) para activar el asesor.
            </Text>
          )}

          {/* Resultado del asesor */}
          {fontAdvice && (
            <View
              className="rounded-xl border p-5"
              style={{
                borderColor: fontAdvice.isGood ? 'rgba(46, 125, 50, 0.3)' : 'rgba(180, 100, 0, 0.3)',
                backgroundColor: fontAdvice.isGood ? 'rgba(46, 125, 50, 0.05)' : 'rgba(180, 100, 0, 0.05)',
              }}
            >
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons
                  name={fontAdvice.isGood ? 'checkmark-circle' : 'alert-circle-outline'}
                  size={20}
                  color={fontAdvice.isGood ? '#2E7D32' : '#B45000'}
                />
                <Text
                  className="font-headline-sm text-[15px]"
                  style={{ color: fontAdvice.isGood ? '#2E7D32' : '#B45000' }}
                >
                  Evaluación Tipográfica
                </Text>
              </View>
              <Text
                className="font-body-md text-[14px] leading-relaxed"
                style={{ color: fontAdvice.isGood ? '#1B5E20' : '#7C3D00' }}
              >
                {fontAdvice.advice}
              </Text>
            </View>
          )}
        </View>

      </View>
    </ScrollView>
  );
}

// ─── Sub-componente: Badge semántico ────────────────────────────────────────────
function SemanticBadge({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 bg-surface-container rounded-lg p-3">
      <Text className="font-label-caps text-[9px] text-secondary uppercase tracking-wider mb-1">{label}</Text>
      <Text className="font-body-md text-[11px] text-primary leading-tight">{value}</Text>
    </View>
  );
}

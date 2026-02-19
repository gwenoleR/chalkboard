import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { BoulderStatRow } from '@/components/BoulderStatRow';
import { Text } from '@/components/ui/text';
import { useBoulder } from '@/hooks/use-boulder';

const S3 = 'https://socialboulder.s3-eu-west-1.amazonaws.com';
const HERO_HEIGHT = 340;

/** Returns true if the hex color is light (needs dark text). */
function isLightHex(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

/** Returns a human-readable relative duration from an ISO date string. */
function formatAge(isoDate: string): string {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
  if (days < 7) return `${days}j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} sem.`;
  return `${Math.floor(days / 30)} mois`;
}

export default function BoulderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { boulder, gym, loading, error } = useBoulder(id);
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (error || !boulder || !gym) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="font-outfit-bold text-lg text-destructive">{t('common.error')}</Text>
      </View>
    );
  }

  const labelHex = gym.labelsHexa?.[String(boulder.label)];
  const holdsKey = String(boulder.holdsColor);
  const holdsName = gym.holdsColors?.[holdsKey];
  const holdsHex = gym.holdsColorsHexa?.[holdsKey]?.[0];
  const zoneName = boulder.zone != null ? gym.zones?.[String(boulder.zone)]?.name : undefined;
  const routeTypeNames = boulder.routeTypes
    ?.map((rid) => gym.routeTypes?.find(([i]) => i === rid)?.[1][0])
    .filter(Boolean) as string[] | undefined;

  const imageUri = boulder.picture
    ? `${S3}/800/bouldersPics/${boulder.picture.id}.jpg`
    : null;

  const heroTextColor = labelHex && isLightHex(labelHex) ? '#111111' : '#ffffff';

  const stats = [
    { value: boulder.sentsCount, label: t('boulder.sends') },
    { value: boulder.flashesCount, label: t('boulder.flashes') },
    { value: boulder.likesCount, label: t('boulder.likes') },
  ];

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Scrollable body ── */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces>
        {/* Hero image */}
        <View style={{ height: HERO_HEIGHT }}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ flex: 1 }} contentFit="cover" />
          ) : (
            // No photo: use label color as hero background
            <View
              className="flex-1 items-center justify-center"
              style={{ backgroundColor: labelHex ?? '#e5e7eb' }}
            >
              <Text
                className="font-outfit-bold"
                style={{ fontSize: 108, lineHeight: 108, color: heroTextColor, opacity: 0.9 }}
              >
                {boulder.grade}
              </Text>
            </View>
          )}
        </View>

        {/* ── White card overlapping hero ── */}
        <View className="rounded-t-3xl bg-background px-6 pt-8" style={{ marginTop: -28 }}>

          {/* Grade + label color dot */}
          <View className="flex-row items-center gap-3">
            {labelHex ? (
              <View className="h-5 w-5 rounded-full" style={{ backgroundColor: labelHex }} />
            ) : null}
            <Text className="font-outfit-bold" style={{ fontSize: 56, lineHeight: 60 }}>
              {boulder.grade}
            </Text>
          </View>

          {/* Subtitle: #num · zone · gym */}
          <Text className="mt-1 font-dm-sans text-base text-muted-foreground">
            {[
              boulder.boulderNum != null && `#${boulder.boulderNum}`,
              zoneName,
              gym.name,
            ]
              .filter(Boolean)
              .join('  ·  ')}
          </Text>

          {/* Stats row */}
          <View className="mt-5 border-y border-border">
            <BoulderStatRow stats={stats} />
          </View>

          {/* Holds color */}
          {holdsName ? (
            <View className="flex-row items-center gap-4 py-5">
              {holdsHex ? (
                <View
                  className="h-8 w-8 rounded-full border border-border"
                  style={{ backgroundColor: holdsHex }}
                />
              ) : null}
              <View>
                <Text className="font-dm-sans text-xs uppercase tracking-widest text-muted-foreground">
                  {t('boulder.holdsColor')}
                </Text>
                <Text className="font-dm-sans-semibold mt-0.5 text-base capitalize">
                  {holdsName}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Route types */}
          {routeTypeNames && routeTypeNames.length > 0 ? (
            <>
              <View className="h-px bg-border" />
              <View className="py-5">
                <Text className="mb-3 font-dm-sans text-xs uppercase tracking-widest text-muted-foreground">
                  {t('boulder.routeTypes')}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {routeTypeNames.map((name) => (
                    <View key={name} className="rounded-full border border-border px-4 py-1.5">
                      <Text className="font-dm-sans text-sm">{name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : null}

          {/* Age */}
          <View className="h-px bg-border" />
          <View className="flex-row items-center gap-4 py-5">
            <Calendar size={20} color="#94a3b8" />
            <Text className="font-dm-sans text-sm text-muted-foreground">
              {t('boulder.openedAgo', { duration: formatAge(boulder.createdAt) })}
            </Text>
          </View>

          {/* Zone */}
          {zoneName ? (
            <>
              <View className="h-px bg-border" />
              <View className="flex-row items-center gap-4 py-5">
                <MapPin size={20} color="#94a3b8" />
                <Text className="font-dm-sans text-sm text-muted-foreground">{zoneName}</Text>
              </View>
            </>
          ) : null}

          {/* Spacer so content isn't hidden behind sticky bottom bar */}
          <View style={{ height: 110 }} />
        </View>
      </ScrollView>

      {/* ── Floating back button ── */}
      <Pressable
        onPress={() => router.back()}
        className="absolute items-center justify-center rounded-full bg-background/90"
        style={{
          top: insets.top + 12,
          left: 16,
          width: 40,
          height: 40,
          // Shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <ArrowLeft size={20} color="#111111" />
      </Pressable>

      {/* ── Sticky bottom bar ── */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row gap-3 border-t border-border bg-background px-6"
        style={{ paddingTop: 16, paddingBottom: insets.bottom + 16 }}
      >
        {/* Flash — outline */}
        <Pressable className="flex-1 items-center justify-center rounded-full border border-border py-4 active:opacity-70">
          <Text className="font-outfit-semibold text-base">{t('boulder.flash')}</Text>
        </Pressable>

        {/* Send — primary filled */}
        <Pressable
          className="items-center justify-center rounded-full bg-primary py-4 active:opacity-80"
          style={{ flex: 2 }}
        >
          <Text className="font-outfit-semibold text-base text-white">{t('boulder.send')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

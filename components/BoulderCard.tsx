import { View } from 'react-native';
import { Image } from 'expo-image';
import { Check, Heart, MessageCircle, Video } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { GymMap } from '@/components/GymMap';
import { Text } from '@/components/ui/text';
import type { Boulder } from '@/types/boulder';
import type { Gym } from '@/types/gym';

const S3 = 'https://socialboulder.s3-eu-west-1.amazonaws.com';

/**
 * Returns true if the given hex color is light enough to require dark text.
 * Uses the WCAG relative luminance formula.
 */
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

interface BoulderCardProps {
  boulder: Boulder;
  gym: Gym;
}

export function BoulderCard({ boulder, gym }: BoulderCardProps) {
  const { t } = useTranslation();
  const labelHex = gym.labelsHexa?.[String(boulder.label)];
  const holdsKey = String(boulder.holdsColor);
  const holdsName = gym.holdsColors?.[holdsKey];
  const holdsHex = gym.holdsColorsHexa?.[holdsKey]?.[0];
  const zoneName = boulder.zone != null ? gym.zones?.[String(boulder.zone)]?.name : undefined;

  const routeTypeNames = boulder.routeTypes
    ?.map((id) => gym.routeTypes?.find(([rid]) => rid === id)?.[1][0])
    .filter(Boolean) as string[] | undefined;

  const imageUri = boulder.picture
    ? `${S3}/400/bouldersPics/${boulder.picture.id}.jpg`
    : null;

  const holdsTextColor = holdsHex && isLightColor(holdsHex) ? '#111111' : '#ffffff';

  return (
    <View className="mb-8">
      {/* Photo */}
      <View className="w-full overflow-hidden rounded-2xl bg-muted" style={{ aspectRatio: 4 / 3 }}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="font-outfit-bold text-5xl text-muted-foreground">{boulder.grade}</Text>
          </View>
        )}
        {/* Beta badge (top-left) — shown when demo videos exist */}
        {boulder.videosCount > 0 ? (
          <View className="absolute left-3 top-3 flex-row items-center gap-1 rounded-full bg-black/60 px-3 py-1">
            <Video size={12} color="#ffffff" strokeWidth={2} />
            <Text className="text-xs font-semibold text-white">{t('boulder.betaBadge')}</Text>
          </View>
        ) : null}
        {/* Holds color badge overlay (top-right) */}
        {holdsHex && holdsName ? (
          <View
            className="absolute right-3 top-3 rounded-full px-3 py-1"
            style={{ backgroundColor: holdsHex }}
          >
            <Text className="text-xs font-semibold" style={{ color: holdsTextColor }}>
              {holdsName}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View className="mt-2 flex-row items-start justify-between px-1">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center gap-2">
            {labelHex ? (
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: labelHex }}
              />
            ) : null}
            <Text className="font-outfit-bold text-base">{boulder.grade}</Text>
            {boulder.sentsCount > 0 ? (
              <View className="flex-row items-center gap-1 ml-1">
                <Check size={13} strokeWidth={2.5} color="#6b7280" />
                <Text className="font-dm-sans text-sm text-muted-foreground">{boulder.sentsCount}</Text>
              </View>
            ) : null}
            {boulder.likesCount > 0 ? (
              <View className="flex-row items-center gap-1 ml-1">
                <Heart size={13} strokeWidth={2.5} color="#6b7280" />
                <Text className="font-dm-sans text-sm text-muted-foreground">{boulder.likesCount}</Text>
              </View>
            ) : null}
            {boulder.commentsCount > 0 ? (
              <View className="flex-row items-center gap-1 ml-1">
                <MessageCircle size={13} strokeWidth={2.5} color="#6b7280" />
                <Text className="font-dm-sans text-sm text-muted-foreground">{boulder.commentsCount}</Text>
              </View>
            ) : null}
          </View>
          {routeTypeNames?.length ? (
            <Text className="font-dm-sans text-sm text-muted-foreground">
              {routeTypeNames.join(' · ')}
            </Text>
          ) : null}
          {zoneName ? (
            <Text className="font-dm-sans text-sm text-muted-foreground">{zoneName}</Text>
          ) : null}
        </View>

        {/* Mini map */}
        {gym.map ? (
          <View className="self-center overflow-hidden rounded-lg">
            <GymMap
              map={gym.map}
              zones={gym.zones}
              activeZone={boulder.zone != null ? String(boulder.zone) : null}
              width={72}
              compact
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

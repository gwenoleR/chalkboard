import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Check, Heart, MessageCircle, Video } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { GymMap } from '@/components/GymMap';
import { IconBadge } from '@/components/IconBadge';
import { IconStat } from '@/components/IconStat';
import { Hold } from '@/lib/icons/hold';
import { isLightColor } from '@/lib/color';
import { Text } from '@/components/ui/text';
import type { Boulder } from '@/types/boulder';
import type { Gym } from '@/types/gym';

const S3 = 'https://socialboulder.s3-eu-west-1.amazonaws.com';

interface BoulderCardProps {
  boulder: Boulder;
  gym: Gym;
  onPress?: () => void;
}

export function BoulderCard({ boulder, gym, onPress }: BoulderCardProps) {
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
    <Pressable className="mb-8 active:opacity-80" onPress={onPress}>
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
        {boulder.videosCount > 0 ? (
          <View className="absolute left-3 top-3">
            <IconBadge icon={Video} label={t('boulder.betaBadge')} />
          </View>
        ) : null}
        {holdsHex && holdsName ? (
          <View className="absolute right-3 top-3">
            <IconBadge
              icon={Hold}
              label={holdsName}
              backgroundColor={holdsHex}
              color={holdsTextColor}
            />
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View className="mt-2 flex-row items-start justify-between px-1">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center gap-2">
            {labelHex ? (
              <View className="h-3 w-3 rounded-full" style={{ backgroundColor: labelHex }} />
            ) : null}
            <Text className="font-outfit-bold text-base">{boulder.grade}</Text>
            <IconStat icon={Check} value={boulder.sentsCount} />
            <IconStat icon={Heart} value={boulder.likesCount} />
            <IconStat icon={MessageCircle} value={boulder.commentsCount} />
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
    </Pressable>
  );
}

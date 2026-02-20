import { View } from 'react-native';
import { Image } from 'expo-image';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { GymInfo } from '@/lib/known-gyms';
import { getGymLogoUrl } from '@/lib/known-gyms';

export interface GymAvatarProps {
  gym: GymInfo;
  /** Side length in pixels. Defaults to 36. */
  size?: number;
  className?: string;
}

/**
 * Rounded-square avatar for a gym.
 * Shows the gym logo when available, otherwise falls back to initials
 * (first letter of each word in the gym name).
 */
export function GymAvatar({ gym, size = 36, className }: GymAvatarProps) {
  const logoUrl = getGymLogoUrl(gym);
  const initials = gym.name
    .split(/[\s/–-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <View
      className={cn('items-center justify-center overflow-hidden rounded-lg bg-muted', className)}
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        <Image
          source={{ uri: logoUrl }}
          style={{ width: size - 8, height: size - 8 }}
          contentFit="contain"
        />
      ) : (
        <Text className="font-outfit-bold text-muted-foreground" style={{ fontSize: size * 0.32 }}>
          {initials}
        </Text>
      )}
    </View>
  );
}

export default GymAvatar;

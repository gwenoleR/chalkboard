import { View } from 'react-native';
import { Image } from 'expo-image';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
}

/** Returns up to 2 uppercase initials from a display name. */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Displays a circular avatar: photo if avatarUrl is provided, initials otherwise.
 */
export function Avatar({ name, avatarUrl, size = 64 }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <View
      className={cn('items-center justify-center overflow-hidden rounded-full bg-primary')}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: size, height: size }}
          contentFit="cover"
        />
      ) : (
        <Text
          className="font-outfit-bold text-primary-foreground"
          style={{ fontSize: size * 0.35 }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

import { View } from 'react-native';

import { Text } from '@/components/ui/text';

interface UserAvatarProps {
  name: string;
  size?: number;
}

/** Returns up to 2 uppercase initials from a full name. */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Circular avatar displaying the user's initials.
 * Used as a fallback until photo avatars are available from the API.
 */
export function UserAvatar({ name, size = 40 }: UserAvatarProps) {
  const initials = getInitials(name);
  return (
    <View
      className="items-center justify-center rounded-full bg-accent"
      style={{ width: size, height: size }}
    >
      <Text
        className="font-outfit-semibold text-accent-foreground"
        style={{ fontSize: Math.round(size * 0.36) }}
      >
        {initials}
      </Text>
    </View>
  );
}

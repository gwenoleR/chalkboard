import { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';

import { Text } from '@/components/ui/text';

interface IconStatProps {
  icon: React.ComponentType<LucideProps>;
  value: number;
  color?: string;
  fill?: string;
}

/**
 * Compact inline stat: an icon followed by a numeric value.
 * Renders nothing when value is 0.
 */
export function IconStat({ icon: Icon, value, color = '#6b7280', fill = 'transparent' }: IconStatProps) {
  if (value <= 0) return null;
  return (
    <View className="flex-row items-center gap-1">
      <Icon size={13} strokeWidth={2.5} color={color} fill={fill} />
      <Text className="font-dm-sans text-sm text-muted-foreground">{value}</Text>
    </View>
  );
}

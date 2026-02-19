import { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';

import { Text } from '@/components/ui/text';

interface IconBadgeProps {
  icon: React.ComponentType<LucideProps>;
  label: string;
  /** Background color. Defaults to semi-transparent black. */
  backgroundColor?: string;
  /** Icon and text color. Defaults to white. */
  color?: string;
}

/**
 * Pill-shaped badge with an icon and a text label, designed for photo overlays.
 * Color contrast must be ensured by the caller.
 */
export function IconBadge({ icon: Icon, label, backgroundColor = 'rgba(0,0,0,0.6)', color = '#ffffff' }: IconBadgeProps) {
  return (
    <View className="flex-row items-center gap-1 rounded-full px-3 py-1" style={{ backgroundColor }}>
      <Icon size={12} strokeWidth={2} color={color} />
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

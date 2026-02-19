import { Fragment } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

export interface StatItem {
  value: number | string;
  label: string;
}

interface BoulderStatRowProps {
  stats: StatItem[];
}

/**
 * Horizontal stat row with vertical separators between items, Airbnb-style.
 * Each stat shows a bold value above a muted label, all evenly distributed.
 */
export function BoulderStatRow({ stats }: BoulderStatRowProps) {
  return (
    <View className="flex-row items-stretch py-5">
      {stats.map((stat, index) => (
        <Fragment key={stat.label}>
          {index > 0 && <View className="my-1 w-px bg-border" />}
          <View className="flex-1 items-center justify-center px-2">
            <Text className="font-outfit-bold text-2xl">{stat.value}</Text>
            <Text className="mt-0.5 font-dm-sans text-xs text-muted-foreground">{stat.label}</Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

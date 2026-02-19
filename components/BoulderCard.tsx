import { View } from 'react-native';

import { HoldsColorBadge } from '@/components/HoldsColorBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { Boulder } from '@/types/boulder';
import type { Gym } from '@/types/gym';

interface BoulderCardProps {
  boulder: Boulder;
  gym: Gym;
}

export function BoulderCard({ boulder, gym }: BoulderCardProps) {
  const labelHex = gym.labelsHexa?.[String(boulder.label)];
  const holdsKey = String(boulder.holdsColor);
  const holdsName = gym.holdsColors?.[holdsKey];
  const holdsHex = gym.holdsColorsHexa?.[holdsKey]?.[0];

  const routeTypeNames = boulder.routeTypes
    ?.map((id) => gym.routeTypes?.find(([rid]) => rid === id)?.[1][0])
    .filter(Boolean) as string[] | undefined;

  return (
    <Card className="mb-3 flex-row overflow-hidden py-0">
      {/* Label color band */}
      <View
        className="w-2.5 flex-shrink-0 rounded-l-xl"
        style={labelHex ? { backgroundColor: labelHex } : undefined}
      />

      <CardContent className="flex-1 flex-row items-center gap-3 px-4 py-3">
        {/* Grade + route types */}
        <View className="flex-1 gap-1">
          <Text className="font-outfit-bold text-xl">{boulder.grade}</Text>
          {routeTypeNames?.length ? (
            <Text className="font-dm-sans text-xs text-muted-foreground">
              {routeTypeNames.join(' · ')}
            </Text>
          ) : null}
        </View>

        {/* Holds color badge */}
        {holdsName ? <HoldsColorBadge name={holdsName} hex={holdsHex} /> : null}
      </CardContent>
    </Card>
  );
}

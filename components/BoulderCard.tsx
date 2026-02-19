import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { Boulder } from '@/types/boulder';
import type { Gym } from '@/types/gym';

interface BoulderCardProps {
  boulder: Boulder;
  gym: Gym;
}

export function BoulderCard({ boulder, gym }: BoulderCardProps) {
  const labelHex = gym.labelsHexa?.[String(boulder.label)];
  const labelName = gym.labels?.[String(boulder.label)];
  const holdsSuffix = boulder.holdsColor ? ` · prises ${boulder.holdsColor}` : '';

  return (
    <Card className="mb-3 flex-row overflow-hidden py-0">
      {/* Color band */}
      <View
        className="w-2.5 flex-shrink-0 rounded-l-xl"
        style={labelHex ? { backgroundColor: labelHex } : undefined}
      />

      <CardContent className="flex-1 flex-row items-center gap-3 px-4 py-3">
        {/* Grade + label + holds */}
        <View className="flex-1 gap-0.5">
          <Text className="font-outfit-bold text-xl">{boulder.grade}</Text>
          {labelName ? (
            <Text className="font-dm-sans text-sm capitalize text-muted-foreground">
              {labelName}
              {holdsSuffix}
            </Text>
          ) : null}
        </View>

        {/* Send count badge */}
        <Badge
          variant={boulder.sentsCount > 0 ? 'default' : 'secondary'}
          className={cn('flex-col items-center gap-0 px-3 py-1.5')}
        >
          <Text className="font-outfit-bold text-base">{boulder.sentsCount}</Text>
          <Text className="font-dm-sans text-xs opacity-75">sends</Text>
        </Badge>
      </CardContent>
    </Card>
  );
}

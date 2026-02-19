import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { BoulderCard } from '@/components/BoulderCard';
import { GymMap } from '@/components/GymMap';
import { useBoulders } from '@/hooks/use-boulders';
import { useGym } from '@/hooks/use-gym';
import type { Boulder } from '@/types/boulder';

interface BoulderSection {
  zoneId: string;
  zoneName: string;
  data: Boulder[];
}

function groupByZone(
  boulders: Boulder[],
  zones: Record<string, { name: string }>
): BoulderSection[] {
  const map = new Map<string, Boulder[]>();

  for (const boulder of boulders) {
    const key = boulder.zone != null ? String(boulder.zone) : '0';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(boulder);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([zoneId, data]) => ({
      zoneId,
      zoneName: zones?.[zoneId]?.name ?? `Zone ${zoneId}`,
      data,
    }));
}

export default function HomeScreen() {
  const { boulders, count, loading: bouldersLoading, error } = useBoulders();
  const { gym, loading: gymLoading } = useGym('wattabloc');
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});

  const loading = bouldersLoading || gymLoading;

  const sections = useMemo(
    () => (gym && !loading ? groupByZone(boulders, gym.zones) : []),
    [boulders, gym, loading]
  );

  const handleZonePress = useCallback((zoneId: string) => {
    setActiveZone(zoneId);
    const y = sectionOffsets.current[zoneId];
    if (y != null) {
      scrollRef.current?.scrollTo({ y, animated: true });
    }
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="font-outfit-bold text-lg text-destructive">Connection error</Text>
        <Text className="mt-2 font-dm-sans text-sm text-muted-foreground">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView ref={scrollRef} contentContainerClassName="px-4 pb-8">
        {/* Header */}
        <Text className="pb-4 pt-4 font-outfit-bold text-2xl">
          {`Wattabloc${count !== null ? ` · ${count} blocs` : ''}`}
        </Text>

        {/* Floor plan */}
        {gym?.map ? (
          <View className="mb-6 items-center rounded-xl border border-border bg-card p-4">
            <GymMap
              map={gym.map}
              zones={gym.zones}
              activeZone={activeZone}
              onZonePress={handleZonePress}
            />
          </View>
        ) : null}

        {/* Sections */}
        {sections.map((section) => (
          <View
            key={section.zoneId}
            onLayout={(e) => {
              sectionOffsets.current[section.zoneId] = e.nativeEvent.layout.y;
            }}
          >
            <View className="pb-2 pt-4">
              <View className="mb-2 flex-row items-baseline gap-2">
                <Text className="font-outfit-semibold text-lg text-foreground">
                  {section.zoneName}
                </Text>
                <Text className="font-dm-sans text-sm text-muted-foreground">
                  {section.data.length} bloc{section.data.length > 1 ? 's' : ''}
                </Text>
              </View>
              <Separator />
            </View>
            {section.data.map((boulder) => (
              <BoulderCard key={boulder.id} boulder={boulder} gym={gym!} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

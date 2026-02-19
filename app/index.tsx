import { ActivityIndicator, FlatList, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/text';
import { BoulderCard } from '@/components/BoulderCard';
import { GymMap } from '@/components/GymMap';
import { useBoulders } from '@/hooks/use-boulders';
import { useGym } from '@/hooks/use-gym';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { boulders, count, loading: bouldersLoading, error } = useBoulders();
  const { gym, loading: gymLoading } = useGym('wattabloc');
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const loading = bouldersLoading || gymLoading;

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
        <Text className="font-outfit-bold text-lg text-destructive">{t('common.connectionError')}</Text>
        <Text className="mt-2 font-dm-sans text-sm text-muted-foreground">{error}</Text>
      </View>
    );
  }

  if (!gym) return null;

  const title =
    count !== null ? `${gym.name} · ${t('gym.boulderCount', { count })}` : gym.name;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={boulders}
        keyExtractor={(b) => b.id}
        contentContainerClassName="px-4 pb-8"
        renderItem={({ item }) => (
          <BoulderCard
            boulder={item}
            gym={gym}
            onPress={() => router.push(`/boulder/${item.id}`)}
          />
        )}
        ListHeaderComponent={
          <View>
            <Text className="pb-4 pt-4 font-outfit-bold text-2xl">{title}</Text>
            {gym.map ? (
              <View className="mb-6 items-center rounded-xl border border-border bg-card p-4">
                <GymMap
                  map={gym.map}
                  zones={gym.zones}
                  activeZone={activeZone}
                  onZonePress={setActiveZone}
                />
              </View>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

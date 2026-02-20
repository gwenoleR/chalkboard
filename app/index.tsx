import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/Avatar';
import { BoulderCard } from '@/components/BoulderCard';
import { GymMap } from '@/components/GymMap';
import { useBoulders } from '@/hooks/use-boulders';
import { useGym } from '@/hooks/use-gym';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useAuth } from '@/lib/auth/auth-context';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const { user } = useCurrentUser();
  const { boulders, count, loading: bouldersLoading, error, refresh } = useBoulders();
  const { gym, loading: gymLoading } = useGym('wattabloc');
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // Re-read the collection when navigating back from the detail screen so
  // stat changes (sends, likes…) made there are reflected immediately.
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

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
            userId={userId ?? undefined}
            onPress={() => router.push(`/boulder/${item.id}`)}
          />
        )}
        ListHeaderComponent={
          <View>
            {/* Top bar: title + avatar */}
            <View className="flex-row items-center justify-between pb-4 pt-4">
              <Text className="font-outfit-bold text-2xl">{title}</Text>
              <Pressable onPress={() => router.push('/profile')} className="active:opacity-70">
                <Avatar
                  name={user?.profile.name ?? '?'}
                  avatarUrl={user?.profile.avatars?.url}
                  size={36}
                />
              </Pressable>
            </View>
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

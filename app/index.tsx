import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/Avatar';
import { BoulderCard } from '@/components/BoulderCard';
import { GymMap } from '@/components/GymMap';
import { GymPickerModal } from '@/components/GymPickerModal';
import { useBoulders } from '@/hooks/use-boulders';
import { useGym } from '@/hooks/use-gym';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useSelectedGym } from '@/hooks/use-selected-gym';
import { useAuth } from '@/lib/auth/auth-context';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useCurrentUser();
  const { gymId, setGymId } = useSelectedGym();
  const pickerRef = useRef<BottomSheetModal>(null);

  // gymId is guaranteed non-null here (layout redirects to /onboarding if null)
  const activeGymId = gymId ?? 'wattabloc';

  const { boulders, count, loading: bouldersLoading, error, refresh } = useBoulders(activeGymId);
  const { gym, loading: gymLoading } = useGym(activeGymId);
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

  const countLabel = count !== null ? ` · ${t('gym.boulderCount', { count })}` : '';

  if (!gym) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
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
            {/* Top bar: gym picker + avatar */}
            <View className="flex-row items-center justify-between pb-4 pt-4">
              <Pressable
                onPress={() => pickerRef.current?.present()}
                className="flex-row items-center gap-1 active:opacity-70"
              >
                <Text className="font-outfit-bold text-2xl">{gym.name}</Text>
                <ChevronDown size={20} className="text-muted-foreground" />
              </Pressable>
              {count !== null && (
                <Text className="font-dm-sans text-sm text-muted-foreground">{t('gym.boulderCount', { count })}</Text>
              )}
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
      <GymPickerModal
        sheetRef={pickerRef as React.RefObject<BottomSheetModal | null>}
        selectedGymId={activeGymId}
        userGymIds={Object.keys(user?.profile?.scores ?? {})}
        onSelect={setGymId}
      />
    </SafeAreaView>
  );
}

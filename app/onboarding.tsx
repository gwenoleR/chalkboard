import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Check, MapPin, Search } from 'lucide-react-native';
import { useState } from 'react';

import { GymAvatar } from '@/components/GymAvatar';
import { Text } from '@/components/ui/text';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useGymsList } from '@/hooks/use-gyms-list';
import { useSelectedGym } from '@/hooks/use-selected-gym';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { GymInfo } from '@/lib/known-gyms';
import { THEME } from '@/lib/theme';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useCurrentUser();
  const { setGymId } = useSelectedGym();
  const { gyms: allGyms, loading: gymsLoading } = useGymsList();

  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const colorScheme = useColorScheme();
  const mutedFg = THEME[colorScheme === 'dark' ? 'dark' : 'light'].mutedForeground;

  const gym = (id: string): GymInfo =>
    allGyms.find((g) => g.id === id) ?? { id, name: id, city: '' };

  const userGymIds: string[] = Object.keys(user?.profile?.scores ?? {});
  const allGymIds = allGyms.map((g) => g.id);
  const myGymIds = userGymIds.filter((id) => allGymIds.includes(id));
  const arkoseIds = allGymIds.filter(
    (id) => (id === 'arkose' || id.startsWith('arkose/')) && !myGymIds.includes(id)
  );
  const remainingIds = allGymIds.filter(
    (id) => !myGymIds.includes(id) && !arkoseIds.includes(id)
  );
  const unknownIds = userGymIds.filter((id) => !allGymIds.includes(id));

  const q = query.trim().toLowerCase();
  const filteredGyms = q
    ? allGyms.filter(
        (g) => g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q)
      )
    : null;

  async function handleConfirm() {
    if (!selected) return;
    await setGymId(selected);
    router.replace('/');
  }

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View className="px-6 pb-3 pt-8">
        <MapPin size={32} color="#e35f8d" />
        <Text className="mt-3 font-outfit-bold text-3xl text-foreground">{t('onboarding.title')}</Text>
        <Text className="mt-1 font-dm-sans text-sm text-muted-foreground">
          {t('onboarding.subtitle')}
        </Text>
      </View>

      {/* Search bar */}
      <View className="mx-4 mb-3 flex-row items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
        <Search size={16} color={mutedFg} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('gymPicker.search')}
          placeholderTextColor={mutedFg}
          className="flex-1 font-dm-sans text-base text-foreground"
          style={{ padding: 0 }}
          autoCorrect={false}
        />
      </View>

      {/* Gym list */}
      <ScrollView className="flex-1 px-4" contentContainerClassName="gap-2 pb-4" keyboardShouldPersistTaps="handled">
        {filteredGyms ? (
          /* Search results — flat list */
          filteredGyms.length === 0 ? (
            <Text className="px-1 py-6 font-dm-sans text-sm text-muted-foreground">
              {t('gymPicker.noResults')}
            </Text>
          ) : (
            filteredGyms.map((g) => (
              <GymOption key={g.id} gym={g} isSelected={selected === g.id} onPress={() => setSelected(g.id)} />
            ))
          )
        ) : (
          /* Sectioned view */
          <>
            {myGymIds.length > 0 && (
              <>
                <Text className="px-1 pb-1 pt-2 font-dm-sans text-xs uppercase text-muted-foreground">
                  {t('gymPicker.myGyms')}
                </Text>
                {myGymIds.map((id) => (
                  <GymOption key={id} gym={gym(id)} isSelected={selected === id} onPress={() => setSelected(id)} />
                ))}
                <View className="my-2 border-b border-border" />
              </>
            )}

            {remainingIds.map((id) => (
              <GymOption key={id} gym={gym(id)} isSelected={selected === id} onPress={() => setSelected(id)} />
            ))}

            {gymsLoading ? (
              <ActivityIndicator size="small" color="#e35f8d" className="my-6" />
            ) : (
              <>
                {arkoseIds.length > 0 && (
                  <>
                    <View className="my-2 border-b border-border" />
                    <Text className="px-1 pb-1 pt-2 font-dm-sans text-xs uppercase text-muted-foreground">
                      {t('gymPicker.arkoseGyms')}
                    </Text>
                    {arkoseIds.map((id) => (
                      <GymOption key={id} gym={gym(id)} isSelected={selected === id} onPress={() => setSelected(id)} />
                    ))}
                  </>
                )}

                {unknownIds.length > 0 && (
                  <>
                    <View className="my-2 border-b border-border" />
                    <Text className="px-1 pb-1 pt-2 font-dm-sans text-xs uppercase text-muted-foreground">
                      {t('gymPicker.otherGyms')}
                    </Text>
                    {unknownIds.map((id) => (
                      <GymOption key={id} gym={gym(id)} isSelected={selected === id} onPress={() => setSelected(id)} />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Confirm button */}
      <View className="px-4 pb-4">
        <Pressable
          onPress={handleConfirm}
          disabled={!selected}
          className={`items-center justify-center rounded-full py-4 ${
            selected ? 'bg-primary active:opacity-80' : 'bg-muted'
          }`}
        >
          <Text
            className={`font-outfit-semibold text-base ${
              selected ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {t('onboarding.confirm')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

interface GymOptionProps {
  gym: GymInfo;
  isSelected: boolean;
  onPress: () => void;
}

function GymOption({ gym, isSelected, onPress }: GymOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-xl border px-4 py-3 active:opacity-70 ${
        isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card'
      }`}
    >
      <GymAvatar gym={gym} size={40} />
      <Text
        className={
          isSelected
            ? 'flex-1 font-outfit-semibold text-base text-primary'
            : 'flex-1 font-outfit text-base text-foreground'
        }
      >
        {gym.name}
      </Text>
      {isSelected && <Check size={18} color="#e35f8d" />}
    </Pressable>
  );
}

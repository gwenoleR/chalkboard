import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Check, Search } from 'lucide-react-native';
import { vars } from 'nativewind';
import { useTranslation } from 'react-i18next';

import { GymAvatar } from '@/components/GymAvatar';
import { Text } from '@/components/ui/text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGymsList } from '@/hooks/use-gyms-list';
import type { GymInfo } from '@/lib/known-gyms';
import { getGymDisplayName } from '@/lib/known-gyms';

export interface GymPickerModalProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  /** Currently selected gym ID */
  selectedGymId: string | null;
  /** Gym IDs to feature at the top (e.g. user.gyms from DDP) */
  userGymIds?: string[];
  onSelect: (gymId: string) => void;
}

// @gorhom/portal renders in a separate React tree — re-inject theme CSS vars
const THEME_VARS = {
  light: vars({
    '--background': '0 0% 100%',
    '--foreground': '340 15% 10%',
    '--card': '0 0% 100%',
    '--card-foreground': '340 15% 10%',
    '--muted': '340 20% 96%',
    '--muted-foreground': '340 10% 45%',
    '--border': '340 20% 88%',
    '--primary': '339 70% 63%',
    '--primary-foreground': '0 0% 100%',
  }),
  dark: vars({
    '--background': '340 15% 8%',
    '--foreground': '340 20% 96%',
    '--card': '340 15% 11%',
    '--card-foreground': '340 20% 96%',
    '--muted': '340 15% 16%',
    '--muted-foreground': '340 10% 60%',
    '--border': '340 15% 20%',
    '--primary': '339 70% 63%',
    '--primary-foreground': '0 0% 100%',
  }),
};

interface GymRowProps {
  gym: GymInfo;
  isSelected: boolean;
  onPress: () => void;
}

function GymRow({ gym, isSelected, onPress }: GymRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-6 py-3 active:opacity-70"
    >
      <GymAvatar gym={gym} size={36} />
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

/**
 * Bottom sheet modal to switch between gyms.
 * Shows user's own gyms first (if provided), then all known gyms.
 * Controlled via sheetRef.current?.present() / .dismiss().
 */
export function GymPickerModal({
  sheetRef,
  selectedGymId,
  userGymIds = [],
  onSelect,
}: GymPickerModalProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bgColor = isDark ? '#1e1418' : '#ffffff';
  const handleColor = isDark ? '#374151' : '#d1d5db';
  const inputText = isDark ? '#f0e8ed' : '#1a0d12';
  const { gyms: allGyms, loading: gymsLoading } = useGymsList();
  const [query, setQuery] = useState('');

  const snapPoints = useMemo(() => ['50%', '80%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
    ),
    []
  );

  const gym = (id: string): GymInfo =>
    allGyms.find((g) => g.id === id) ?? { id, name: getGymDisplayName(id), city: '' };

  const allGymIds = allGyms.map((g) => g.id);
  const myGymIds = userGymIds.filter((id) => allGymIds.includes(id));
  const arkoseIds = allGymIds.filter(
    (id) => (id === 'arkose' || id.startsWith('arkose/')) && !myGymIds.includes(id)
  );
  const remainingIds = allGymIds.filter(
    (id) => !myGymIds.includes(id) && !arkoseIds.includes(id)
  );
  const unknownGyms = userGymIds.filter((id) => !allGymIds.includes(id));

  const q = query.trim().toLowerCase();
  const filteredGyms = q
    ? allGyms.filter(
        (g) => g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q)
      )
    : null;

  function handleSelect(gymId: string) {
    onSelect(gymId);
    sheetRef.current?.dismiss();
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: bgColor }}
      handleIndicatorStyle={{ backgroundColor: handleColor }}
    >
      <View style={isDark ? THEME_VARS.dark : THEME_VARS.light} className="flex-1">
        <Text className="px-6 pb-2 pt-4 font-outfit-bold text-lg text-foreground">
          {t('gymPicker.title')}
        </Text>

        {/* Search bar — BottomSheetTextInput doesn't support className, use bg-card via NativeWind on wrapper */}
        <View className="mx-4 mb-2 flex-row items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
          <Search size={16} color="hsl(var(--muted-foreground))" />
          <BottomSheetTextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('gymPicker.search')}
            placeholderTextColor="hsl(var(--muted-foreground))"
            style={{ flex: 1, fontFamily: 'DMSans_400Regular', fontSize: 15, color: inputText, padding: 0 }}
            autoCorrect={false}
          />
        </View>

        <BottomSheetScrollView keyboardShouldPersistTaps="handled">
          {filteredGyms ? (
            /* Search results — flat list */
            filteredGyms.length === 0 ? (
              <Text className="px-6 py-6 font-dm-sans text-sm text-muted-foreground">
                {t('gymPicker.noResults')}
              </Text>
            ) : (
              filteredGyms.map((g) => (
                <GymRow
                  key={g.id}
                  gym={g}
                  isSelected={selectedGymId === g.id}
                  onPress={() => handleSelect(g.id)}
                />
              ))
            )
          ) : (
            /* Sectioned view */
            <>
              {myGymIds.length > 0 && (
                <>
                  <Text className="px-6 pb-1 pt-3 font-dm-sans text-xs uppercase text-muted-foreground">
                    {t('gymPicker.myGyms')}
                  </Text>
                  {myGymIds.map((id) => (
                    <GymRow
                      key={id}
                      gym={gym(id)}
                      isSelected={selectedGymId === id}
                      onPress={() => handleSelect(id)}
                    />
                  ))}
                  <View className="mx-6 my-2 border-b border-border" />
                </>
              )}

              {remainingIds.map((id) => (
                <GymRow
                  key={id}
                  gym={gym(id)}
                  isSelected={selectedGymId === id}
                  onPress={() => handleSelect(id)}
                />
              ))}

              {gymsLoading ? (
                <ActivityIndicator size="small" color="#e35f8d" className="my-6" />
              ) : (
                <>
                  {arkoseIds.length > 0 && (
                    <>
                      <View className="mx-6 my-2 border-b border-border" />
                      <Text className="px-6 pb-1 pt-3 font-dm-sans text-xs uppercase text-muted-foreground">
                        {t('gymPicker.arkoseGyms')}
                      </Text>
                      {arkoseIds.map((id) => (
                        <GymRow
                          key={id}
                          gym={gym(id)}
                          isSelected={selectedGymId === id}
                          onPress={() => handleSelect(id)}
                        />
                      ))}
                    </>
                  )}

                  {unknownGyms.length > 0 && (
                    <>
                      <View className="mx-6 my-2 border-b border-border" />
                      <Text className="px-6 pb-1 pt-3 font-dm-sans text-xs uppercase text-muted-foreground">
                        {t('gymPicker.otherGyms')}
                      </Text>
                      {unknownGyms.map((id) => (
                        <GymRow
                          key={id}
                          gym={gym(id)}
                          isSelected={selectedGymId === id}
                          onPress={() => handleSelect(id)}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
}

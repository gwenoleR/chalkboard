import { useCallback, useMemo } from 'react';
import { ActivityIndicator, ListRenderItem, StyleSheet, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { vars } from 'nativewind';
import { useTranslation } from 'react-i18next';

import { UserAvatar } from '@/components/UserAvatar';
import { Text } from '@/components/ui/text';
import { useBoulderUsers } from '@/hooks/use-boulder-users';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { User } from '@/types/user';

export interface UserListSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  title: string;
  userIds: string[];
}

// @gorhom/portal renders in a separate React tree, breaking react-native-css-interop's
// VariableContext. Explicitly re-inject theme CSS vars so NativeWind tokens resolve correctly.
const THEME_VARS = {
  light: vars({
    '--background': '0 0% 100%',
    '--foreground': '340 15% 10%',
    '--card': '0 0% 100%',
    '--card-foreground': '340 15% 10%',
    '--muted': '340 20% 96%',
    '--muted-foreground': '340 10% 45%',
    '--accent': '340 20% 94%',
    '--accent-foreground': '339 70% 50%',
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
    '--accent': '340 15% 18%',
    '--accent-foreground': '339 70% 70%',
    '--border': '340 15% 20%',
    '--primary': '339 70% 63%',
    '--primary-foreground': '0 0% 100%',
  }),
};

function UserRow({ user }: { user: User }) {
  return (
    <View className="flex-row items-center gap-3 px-6 py-3">
      <UserAvatar name={user.profile.name} />
      <Text className="font-dm-sans-medium text-base">{user.profile.name}</Text>
    </View>
  );
}

const renderItem: ListRenderItem<User> = ({ item }: { item: User }) => <UserRow user={item} />;

/**
 * Bottom sheet listing users who sent, flashed, or liked a boulder.
 * Controlled imperatively via `sheetRef.current?.present()` / `.dismiss()`.
 *
 * Note on backgroundStyle: uses hex colors because RN inline styles don't support
 * CSS Level 4 hsl() space syntax. Border radius is handled by gorhom's default component.
 */
export function UserListSheet({ sheetRef, title, userIds }: UserListSheetProps) {
  const { t } = useTranslation();
  const { users, loading } = useBoulderUsers(userIds);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  // Hex equivalents of card theme token — hsl() not valid in RN inline styles
  const bgColor = isDark ? '#1e1418' : '#ffffff';
  const handleColor = isDark ? '#374151' : '#d1d5db';

  const snapPoints = useMemo(() => ['50%', '80%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: bgColor }}
      handleIndicatorStyle={{ backgroundColor: handleColor }}
    >
      {/* Re-inject CSS vars lost when @gorhom/portal breaks the VariableContext */}
      <View style={[styles.flex, isDark ? THEME_VARS.dark : THEME_VARS.light]}>
        {loading ? (
          <BottomSheetView style={styles.flex}>
            <View className="px-6 pb-3 pt-1">
              <Text className="font-outfit-bold text-lg">{title}</Text>
            </View>
            <View className="flex-1 items-center justify-center py-12">
              <ActivityIndicator className="text-primary" />
            </View>
          </BottomSheetView>
        ) : (
          <BottomSheetFlatList
            data={users}
            keyExtractor={(item: User) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={
              <View className="px-6 pb-3 pt-1">
                <Text className="font-outfit-bold text-lg">{title}</Text>
                <Text className="font-dm-sans text-sm text-muted-foreground">
                  {t('boulder.userCount', { count: userIds.length })}
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )}
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

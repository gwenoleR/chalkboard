import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, LogOut } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Avatar } from '@/components/Avatar';
import { GymStatsCard } from '@/components/GymStatsCard';
import { useAuth } from '@/lib/auth/auth-context';
import { useCurrentUser } from '@/hooks/use-current-user';
import type { UserGymScores } from '@/types/user';

/** Returns true if a gym has any recorded activity. */
function hasActivity(scores: UserGymScores): boolean {
  return !!(scores.lastSend ?? scores.bestGrades?.['0']);
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId, isGuest, logout } = useAuth();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }
  const { user, loading } = useCurrentUser();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  // Guest: show login CTA
  if (isGuest || !userId) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <Pressable onPress={handleBack} className="px-4 py-3 self-start active:opacity-70">
          <ArrowLeft size={24} className="text-foreground" />
        </Pressable>
        <View className="flex-1 items-center justify-center px-6">
          <Avatar name="?" size={72} />
          <Text className="mt-4 font-outfit-bold text-xl text-foreground">{t('profile.guest')}</Text>
          <Pressable
            onPress={() => router.replace('/login')}
            className="mt-6 items-center justify-center rounded-full bg-primary px-8 py-4 active:opacity-80"
          >
            <Text className="font-outfit-semibold text-base text-primary-foreground">
              {t('profile.loginCta')}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const name = user?.profile.name ?? '';
  const avatarUrl = user?.profile.avatars?.url;
  const favoriteGyms = user?.favoriteGyms ?? [];
  const scores = user?.profile.scores ?? {};

  // Only show gyms with any recorded activity
  const activeGyms = (user?.gyms ?? []).filter(
    (gym) => scores[gym] && hasActivity(scores[gym])
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pb-12"
      style={{ paddingTop: insets.top }}
    >
      {/* Back button */}
      <Pressable onPress={handleBack} className="px-4 py-3 self-start active:opacity-70">
        <ArrowLeft size={24} className="text-foreground" />
      </Pressable>

      {/* Header */}
      <View className="items-center px-6 py-4">
        <Avatar name={name} avatarUrl={avatarUrl} size={80} />
        <Text className="mt-4 font-outfit-bold text-2xl text-foreground">{name}</Text>
        {favoriteGyms.length > 0 && (
          <Text className="mt-1 font-dm-sans text-sm text-muted-foreground">
            {t('profile.favoriteGyms')}: {favoriteGyms.join(', ')}
          </Text>
        )}
      </View>

      {/* Stats per gym */}
      {activeGyms.length === 0 ? (
        <View className="px-6">
          <Text className="font-dm-sans text-sm text-muted-foreground">{t('profile.noActivity')}</Text>
        </View>
      ) : (
        <View className="gap-4 px-4">
          {activeGyms.map((gym) => (
            <GymStatsCard
              key={gym}
              gymSlug={gym}
              userId={userId}
              scores={scores[gym]}
            />
          ))}
        </View>
      )}

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        className="mx-4 mt-8 flex-row items-center justify-center gap-2 rounded-xl border border-destructive py-4 active:opacity-70"
      >
        <LogOut size={18} color="#e35f8d" />
        <Text className="font-outfit-semibold text-base text-destructive">{t('profile.logout')}</Text>
      </Pressable>
    </ScrollView>
  );
}

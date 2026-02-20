import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/ui/text';
import { useUserSendsCount } from '@/hooks/use-user-sends-count';
import { ddpDateToDate } from '@/types/boulder';
import type { UserGymScores } from '@/types/user';

interface GymStatsCardProps {
  gymSlug: string;
  userId: string;
  scores: UserGymScores;
}

/** Returns the overall best grade from bestGrades["0"] (server-maintained). */
function bestGrade(scores: UserGymScores): string | null {
  return scores.bestGrades?.['0'] ?? null;
}

/**
 * Displays a single gym's stats: total sends (incl. closed boulders),
 * best grade, and date of last send.
 */
export function GymStatsCard({ gymSlug, userId, scores }: GymStatsCardProps) {
  const { t } = useTranslation();
  const { count } = useUserSendsCount(gymSlug, userId);
  const best = bestGrade(scores);
  const lastSendDate = scores.lastSend ? ddpDateToDate(scores.lastSend) : null;

  const totalCount = count ?? 0;

  return (
    <View className="rounded-xl border border-border bg-card p-4">
      <Text className="font-outfit-semibold text-base text-foreground">{gymSlug}</Text>
      <View className="mt-3 flex-row gap-6">
        <View>
          <Text className="font-dm-sans text-xs text-muted-foreground">{t('profile.sends')}</Text>
          <Text className="font-outfit-bold text-lg text-foreground">{totalCount}</Text>
        </View>
        {best && (
          <View>
            <Text className="font-dm-sans text-xs text-muted-foreground">{t('profile.bestGrade')}</Text>
            <Text className="font-outfit-bold text-lg text-foreground">{best}</Text>
          </View>
        )}
        {lastSendDate && (
          <View>
            <Text className="font-dm-sans text-xs text-muted-foreground">{t('profile.lastSend')}</Text>
            <Text className="font-outfit-bold text-base text-foreground">
              {lastSendDate.toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

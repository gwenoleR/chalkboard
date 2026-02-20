import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ddpDateToDate, type DdpDateLike } from '@/types/boulder';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the number of days until the boulder's planned teardown.
 * Positive = still standing, 0 = today, negative = overdue.
 * Returns null when no teardown date is set.
 */
export function daysUntilTeardown(closedAt: DdpDateLike | undefined): number | null {
  if (!closedAt) return null;
  return Math.ceil((ddpDateToDate(closedAt).getTime() - Date.now()) / 86_400_000);
}

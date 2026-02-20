import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { DdpDate } from '@/types/boulder';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the number of days until the boulder's planned teardown.
 * Positive = still standing, 0 = today, negative = overdue.
 * Returns null when no teardown date is set.
 */
export function daysUntilTeardown(closedAt: DdpDate | undefined): number | null {
  if (!closedAt) return null;
  return Math.ceil((closedAt.$date - Date.now()) / 86_400_000);
}

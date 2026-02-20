import { useEffect, useState } from 'react';

import client, { ensureDDPConnected } from '@/lib/ddp/client';

interface UseUserSendsCountResult {
  count: number | null;
  loading: boolean;
}

/**
 * Returns the total number of boulders sent by a user in a gym,
 * including closed/dismounted boulders.
 *
 * Uses `_boulders.count` with `{ gym, sentsList: userId }` — the same
 * selector Social Boulder uses on the profile page.
 */
export function useUserSendsCount(gymSlug: string, userId: string | null): UseUserSendsCountResult {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setCount(null);
      setLoading(false);
      return;
    }

    let sub: ReturnType<typeof client.subscribe> | null = null;
    let cancelled = false;

    (async () => {
      await ensureDDPConnected();
      if (cancelled) return;

      const selector = { gym: gymSlug, sentsList: userId };
      sub = client.subscribe('_boulders.count', selector);
      await sub.ready();
      if (cancelled) return;

      const counters = client.collection('counters-collection').fetch({}) as { count: number }[];
      setCount(counters[0]?.count ?? 0);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [gymSlug, userId]);

  return { count, loading };
}

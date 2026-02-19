import { useEffect, useRef, useState } from 'react';

import client, { ensureLoggedIn } from '@/lib/ddp/client';
import type { Boulder } from '@/types/boulder';

const GYM = 'wattabloc';
const LIMIT = 200;
const SELECTOR = { gym: GYM, isClosed: null };
const SORT = { isClosed: 1, createdAt: -1, boulderNum: -1, label: -1, holdsColor: -1 };

interface UseBoulders {
  boulders: Boulder[];
  count: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Subscribes to the boulder list and count for the hardcoded gym.
 * Reactively fetches active boulders (isClosed: null) sorted by recency.
 */
export function useBoulders(): UseBoulders {
  const [boulders, setBoulders] = useState<Boulder[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subList: ReturnType<typeof client.subscribe> | null = null;
    let subCount: ReturnType<typeof client.subscribe> | null = null;

    async function start() {
      try {
        await ensureLoggedIn();

        subCount = client.subscribe('_boulders.count', SELECTOR);
        subList = client.subscribe('_boulders.list', SELECTOR, SORT, LIMIT, null);

        // Fast path: collection data survives fast-refresh (client is on global).
        // Render immediately with cached data while subscriptions re-establish.
        const cached = client.collection('boulders').fetch({}) as Boulder[];
        if (cached.length > 0) {
          setBoulders(cached);
          const cachedCounters = client.collection('counters-collection').fetch({}) as {
            count: number;
          }[];
          if (cachedCounters.length > 0) setCount(cachedCounters[0].count);
          setLoading(false);
        }

        await Promise.all([subCount.ready(), subList.ready()]);

        const raw = client.collection('boulders').fetch({}) as Boulder[];
        setBoulders(raw);

        const counters = client.collection('counters-collection').fetch({}) as { count: number }[];
        if (counters.length > 0) setCount(counters[0].count);

        setLoading(false);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'DDP error');
        setLoading(false);
      }
    }

    start();

    return () => {
      subList?.stop();
      subCount?.stop();
    };
  }, []);

  return { boulders, count, loading, error };
}

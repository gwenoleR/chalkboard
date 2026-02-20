import { useEffect, useState } from 'react';

import client, { ensureDDPConnected } from '@/lib/ddp/client';
import { KNOWN_GYMS } from '@/lib/known-gyms';
import type { GymInfo } from '@/lib/known-gyms';

/**
 * Fetches all active permanent gyms via `_gyms.list`.
 * Filters out contest/event entries by requiring `bouldersLifeLength`
 * (permanent gyms track how long boulders stay up; contests don't).
 * Merges with KNOWN_GYMS to ensure gyms like `wattabloc` (not always
 * returned by the subscription) are always present.
 */
export function useGymsList(): { gyms: GymInfo[]; loading: boolean } {
  const [gyms, setGyms] = useState<GymInfo[]>(KNOWN_GYMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: ReturnType<typeof client.subscribe> | null = null;
    let cancelled = false;

    (async () => {
      try {
        await ensureDDPConnected();
        if (cancelled) return;

        sub = client.subscribe('_gyms.list', { closed: null, hidden: { $in: [null, false] } });
        await sub.ready();
        if (cancelled) return;

        type RawGym = {
          id: string;
          slug?: string;
          name?: string;
          city?: string;
          bouldersLifeLength?: number;
          contestType?: string;
          startDate?: unknown;
          filesGym?: string;
          logoType?: string;
        };

        const raw = client.collection('gyms').fetch({}) as RawGym[];

        // Only keep permanent gyms:
        // - have bouldersLifeLength (contests/events don't track boulder lifetime)
        // - no contestType or startDate (time-limited events have these)
        // - valid slug and name
        const fetched: GymInfo[] = raw
          .filter(
            (g) =>
              g.bouldersLifeLength &&
              g.slug &&
              g.name &&
              !g.contestType &&
              !g.startDate
          )
          .map((g) => ({
            id: g.slug!,
            name: g.name!,
            city: g.city ?? '',
            filesGym: g.filesGym,
            logoType: g.logoType,
          }));

        // Merge: KNOWN_GYMS first (preserves our curated entries), then fetched gyms
        // that are not already known.
        const knownIds = new Set(KNOWN_GYMS.map((g) => g.id));
        const extra = fetched.filter((g) => !knownIds.has(g.id));
        const merged = [...KNOWN_GYMS, ...extra].sort((a, b) => a.name.localeCompare(b.name));

        setGyms(merged);
      } catch {
        // On error, fall back to KNOWN_GYMS (already set as initial state)
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  return { gyms, loading };
}

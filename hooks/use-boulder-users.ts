import { useEffect, useState } from 'react';

import client, { ensureDDPConnected } from '@/lib/ddp/client';
import type { User } from '@/types/user';

interface State {
  /** Serialised + sorted userIds — used to detect changes during render. */
  key: string;
  users: User[];
  loading: boolean;
}

/**
 * Fetches profiles for a list of user IDs via concurrent `users.single` subscriptions.
 * Uses the "adjust state during render" React pattern to reset state synchronously
 * when `userIds` changes, preventing a stale render frame showing the previous list.
 */
export function useBoulderUsers(userIds: string[]): { users: User[]; loading: boolean } {
  const key = userIds.slice().sort().join(',');

  const [state, setState] = useState<State>({ key, users: [], loading: false });

  // Synchronous reset: if key changed, discard stale state before the next commit
  if (state.key !== key) {
    setState({ key, users: [], loading: userIds.length > 0 });
  }

  useEffect(() => {
    if (userIds.length === 0) return;

    let cancelled = false;
    const subs: ReturnType<typeof client.subscribe>[] = [];

    async function load() {
      try {
        await ensureDDPConnected();
        const subscriptions = userIds.map((id) => client.subscribe('users.single', id));
        subs.push(...subscriptions);
        await Promise.allSettled(subscriptions.map((sub) => sub.ready()));
        if (cancelled) return;
        const allUsers = client.collection('users').fetch({}) as User[];
        const fetched = allUsers.filter((u) => userIds.includes(u.id));
        setState({ key, users: fetched, loading: false });
      } catch (e) {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
      }
    }

    load();
    return () => {
      cancelled = true;
      // Use remove() instead of stop(): remove() clears the sub from simpleddp's internal
      // this.subs list. With stop(), the sub stays in the list and the next subscribe() call
      // returns the stale stopped sub, whose ready() then rejects with the pending nosub.
      subs.forEach((sub) => sub.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { users: state.users, loading: state.loading };
}

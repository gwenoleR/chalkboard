import { useEffect, useState } from 'react';

import client, { ensureLoggedIn } from '@/lib/ddp/client';
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
        await ensureLoggedIn();
        const subscriptions = userIds.map((id) => client.subscribe('users.single', id));
        subs.push(...subscriptions);
        await Promise.all(subscriptions.map((sub) => sub.ready()));
        if (cancelled) return;
        const fetched = (client.collection('users').fetch({}) as User[]).filter((u) =>
          userIds.includes(u.id)
        );
        setState({ key, users: fetched, loading: false });
      } catch {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
      }
    }

    load();
    return () => {
      cancelled = true;
      subs.forEach((sub) => sub.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { users: state.users, loading: state.loading };
}

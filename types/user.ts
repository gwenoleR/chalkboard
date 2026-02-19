export interface User {
  /** simpleddp stores the DDP id as `id` (not `_id`) */
  id: string;
  profile: {
    name: string;
  };
}

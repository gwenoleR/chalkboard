// On web, expo-secure-store is a no-op stub. Fall back to localStorage.
// This is intentionally less secure than the native keychain — acceptable for web dev/testing.

const KEY_TOKEN = 'ddp_token';
const KEY_USER_ID = 'ddp_user_id';

export interface StoredCredentials {
  token: string;
  userId: string;
}

export async function saveCredentials(token: string, userId: string): Promise<void> {
  localStorage.setItem(KEY_TOKEN, token);
  localStorage.setItem(KEY_USER_ID, userId);
}

export async function loadCredentials(): Promise<StoredCredentials | null> {
  const token = localStorage.getItem(KEY_TOKEN);
  const userId = localStorage.getItem(KEY_USER_ID);
  if (!token || !userId) return null;
  return { token, userId };
}

export async function clearCredentials(): Promise<void> {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_USER_ID);
}

import * as SecureStore from 'expo-secure-store';

const KEY_TOKEN = 'ddp_token';
const KEY_USER_ID = 'ddp_user_id';

export interface StoredCredentials {
  token: string;
  userId: string;
}

/** Persists the DDP session token and userId in the device keychain. */
export async function saveCredentials(token: string, userId: string): Promise<void> {
  await SecureStore.setItemAsync(KEY_TOKEN, token);
  await SecureStore.setItemAsync(KEY_USER_ID, userId);
}

/** Loads previously saved DDP credentials, or null if none exist. */
export async function loadCredentials(): Promise<StoredCredentials | null> {
  const token = await SecureStore.getItemAsync(KEY_TOKEN);
  const userId = await SecureStore.getItemAsync(KEY_USER_ID);
  if (!token || !userId) return null;
  return { token, userId };
}

/** Removes all stored credentials (on logout or auth failure). */
export async function clearCredentials(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_TOKEN);
  await SecureStore.deleteItemAsync(KEY_USER_ID);
}

import SimpleDDP from 'simpleddp';
import * as Crypto from 'expo-crypto';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const EJSON = require('ejson') as { addType: (name: string, factory: (v: unknown) => unknown) => void };

// Register the Astronomy custom type used by Social Boulder's server-side ODM.
// Without this, simpleddp-core's EJSON.parse throws "Custom EJSON type Astronomy is
// not defined" and silently drops any DDP message containing serialised Astronomy
// objects (e.g. the `userProfile` field in the `comments` collection).
try {
  EJSON.addType('Astronomy', (value: unknown) => value);
} catch {
  // Already registered (e.g. fast-refresh re-execution)
}

// Persist the client and connect promise on `global` so fast-refresh cycles
// reuse the same WebSocket connection instead of creating a new one each time.
declare global {
  var __ddpClient: SimpleDDP | undefined;
  var __ddpConnectPromise: Promise<void> | null | undefined;
}

if (!global.__ddpClient) {
  global.__ddpClient = new SimpleDDP({
    endpoint: process.env.EXPO_PUBLIC_DDP_ENDPOINT!,
    SocketConstructor: WebSocket,
    reconnectInterval: 5000,
  });
}

const client = global.__ddpClient;

/**
 * Ensures the WebSocket is connected. Does NOT authenticate.
 * Call this from data hooks — auth is handled separately by AuthContext.
 */
export async function ensureDDPConnected(): Promise<void> {
  if (global.__ddpConnectPromise) {
    return global.__ddpConnectPromise;
  }
  global.__ddpConnectPromise = client.connect();
  return global.__ddpConnectPromise;
}

interface DDPLoginResult {
  id: string;
  token: string;
  tokenExpires: { $date: number };
}

/**
 * Authenticates with email + password (Meteor standard SHA-256 password hash).
 * Returns the session token and userId on success.
 */
export async function ddpLogin(email: string, password: string): Promise<DDPLoginResult> {
  await ensureDDPConnected();
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return client.call('login', {
    user: { email },
    password: { digest, algorithm: 'sha-256' },
  }) as Promise<DDPLoginResult>;
}

/**
 * Re-authenticates using a previously issued token (persisted in secure storage).
 * Throws if the token is expired or invalid.
 */
export async function ddpResume(token: string): Promise<DDPLoginResult> {
  await ensureDDPConnected();
  return client.call('login', { resume: token }) as Promise<DDPLoginResult>;
}

/** Logs out the current DDP session. */
export async function ddpLogout(): Promise<void> {
  await client.call('logout');
}

export default client;

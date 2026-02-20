import SimpleDDP from 'simpleddp';
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

// Persist the client and login promise on `global` so fast-refresh cycles
// reuse the same WebSocket connection instead of creating a new one each time.
declare global {
  var __ddpClient: SimpleDDP | undefined;
  var __ddpLoginPromise: Promise<void> | null | undefined;
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
 * Ensures login happens only once, even if called concurrently from multiple hooks.
 * Also survives fast-refresh: the promise is stored on `global` alongside the client.
 */
export async function ensureLoggedIn(): Promise<void> {
  if (global.__ddpLoginPromise) {
    return global.__ddpLoginPromise;
  }
  global.__ddpLoginPromise = (async () => {
    await client.connect();
    await client.call('login', { resume: process.env.EXPO_PUBLIC_DDP_TOKEN });
  })();
  return global.__ddpLoginPromise;
}

export default client;

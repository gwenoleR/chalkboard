import SimpleDDP from 'simpleddp';

// Singleton DDP client — shared across the whole app
const client = new SimpleDDP({
  endpoint: process.env.EXPO_PUBLIC_DDP_ENDPOINT!,
  SocketConstructor: WebSocket,
  reconnectInterval: 5000,
});

// Ensures login happens only once, even if called concurrently from multiple hooks
let loginPromise: Promise<void> | null = null;

export async function ensureLoggedIn(): Promise<void> {
  if (loginPromise) return loginPromise;
  loginPromise = (async () => {
    await client.connect();
    await client.call('login', { resume: process.env.EXPO_PUBLIC_DDP_TOKEN });
  })();
  return loginPromise;
}

export default client;

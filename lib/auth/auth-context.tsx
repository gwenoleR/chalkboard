import { createContext, useContext, useEffect, useState } from 'react';
import { ddpLogin, ddpLogout, ddpResume, ensureDDPConnected } from '@/lib/ddp/client';
import { clearCredentials, loadCredentials, saveCredentials } from '@/lib/auth/secure-storage';

interface AuthContextValue {
  /** Authenticated user ID, or null when guest/loading. */
  userId: string | null;
  /** True when the user is browsing without an account. */
  isGuest: boolean;
  /** True while the initial token resume check is in progress. */
  isLoading: boolean;
  /** Attempt email+password login. Throws on failure. */
  login: (email: string, password: string) => Promise<void>;
  /** Skip login and browse as a guest. */
  loginAsGuest: () => void;
  /** Log out and clear stored credentials. */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On mount: try to resume a saved session, fall back to guest.
    (async () => {
      try {
        const creds = await loadCredentials();
        if (creds) {
          const result = await ddpResume(creds.token);
          setUserId(result.id);
        }
      } catch {
        // Token expired or invalid — clear it so the login screen is shown.
        await clearCredentials();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const result = await ddpLogin(email, password);
    await saveCredentials(result.token, result.id);
    setUserId(result.id);
    setIsGuest(false);
  }

  function loginAsGuest(): void {
    // Connect to DDP without auth so public subscriptions work.
    ensureDDPConnected().catch(() => {});
    setIsGuest(true);
    setIsLoading(false);
  }

  async function logout(): Promise<void> {
    try {
      await ddpLogout();
    } catch {
      // Ignore server errors — clear local state regardless.
    }
    await clearCredentials();
    setUserId(null);
    setIsGuest(false);
  }

  return (
    <AuthContext.Provider value={{ userId, isGuest, isLoading, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Returns the current auth state and actions.
 * Must be used inside an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

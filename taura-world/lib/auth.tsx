import * as Crypto from 'expo-crypto';
import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type User = {
  id: number;
  email: string;
};

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type UserRow = { id: number; email: string; password_hash: string; salt: string };

async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore a persisted session on startup.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const row = await db.getFirstAsync<{ id: number; email: string }>(
          `SELECT u.id, u.email FROM session s
           JOIN users u ON u.id = s.user_id
           WHERE s.id = 1`
        );
        if (active && row) {
          setUser({ id: row.id, email: row.email });
        }
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [db]);

  const value = useMemo<AuthContextValue>(() => {
    async function persistSession(userId: number | null) {
      await db.runAsync(`UPDATE session SET user_id = ? WHERE id = 1`, userId);
    }

    return {
      user,
      isLoading,
      async signUp(rawEmail, password) {
        const email = normalizeEmail(rawEmail);
        if (!email.includes('@')) return { ok: false, error: 'Please enter a valid email address.' };
        if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };

        const existing = await db.getFirstAsync<{ id: number }>(
          `SELECT id FROM users WHERE email = ?`,
          email
        );
        if (existing) return { ok: false, error: 'An account with this email already exists.' };

        const salt = Crypto.randomUUID();
        const passwordHash = await hashPassword(password, salt);
        const insert = await db.runAsync(
          `INSERT INTO users (email, password_hash, salt, created_at) VALUES (?, ?, ?, ?)`,
          email,
          passwordHash,
          salt,
          new Date().toISOString()
        );
        const newUser = { id: insert.lastInsertRowId, email };
        await persistSession(newUser.id);
        setUser(newUser);
        return { ok: true };
      },
      async signIn(rawEmail, password) {
        const email = normalizeEmail(rawEmail);
        const row = await db.getFirstAsync<UserRow>(
          `SELECT id, email, password_hash, salt FROM users WHERE email = ?`,
          email
        );
        if (!row) return { ok: false, error: 'No account found for this email.' };

        const passwordHash = await hashPassword(password, row.salt);
        if (passwordHash !== row.password_hash) {
          return { ok: false, error: 'Incorrect password.' };
        }
        const signedInUser = { id: row.id, email: row.email };
        await persistSession(signedInUser.id);
        setUser(signedInUser);
        return { ok: true };
      },
      async signOut() {
        await persistSession(null);
        setUser(null);
      },
    };
  }, [db, user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

/* ==========================================================================
   auth-context.tsx — Supabase Auth Context + useAuth() hook
   Intelligence OS — thiagolab.com
   ========================================================================== */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { User, AuthError } from '@supabase/supabase-js';

/* ── Types ───────────────────────────────────────────────────────────────── */

interface Profile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'pro';
  created_at: string;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/* ── Context ─────────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Helpers ─────────────────────────────────────────────────────────────── */

let browserClient: ReturnType<typeof createClient> | null = null;

function getBrowserClient() {
  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Build / SSR sem env vars — retorna um mock que não faz nada
    browserClient = createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    return browserClient;
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  });

  return browserClient;
}

/* ── Provider ────────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = getBrowserClient();
  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  /* ── Buscar perfil no Supabase ────────────────────────────────────────── */
  const refreshProfile = useCallback(async () => {
    if (!isConfigured) return;
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      setProfile(null);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    setProfile(data as Profile | null);
  }, [supabase, isConfigured]);

  /* ── Inicializar sessão ────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    const init = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await refreshProfile();
      }

      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await refreshProfile();
        } else {
          setProfile(null);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase, refreshProfile, isConfigured]);

  /* ── Sign In: Google ──────────────────────────────────────────────────── */
  const signInWithGoogle = useCallback(async () => {
    if (!isConfigured) return;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${appUrl}/auth/callback`,
      },
    });
  }, [supabase, isConfigured]);

  /* ── Sign In: GitHub ──────────────────────────────────────────────────── */
  const signInWithGitHub = useCallback(async () => {
    if (!isConfigured) return;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${appUrl}/auth/callback`,
      },
    });
  }, [supabase, isConfigured]);

  /* ── Sign In: Email/Senha ─────────────────────────────────────────────── */
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!isConfigured) return { error: new Error('Supabase não configurado') as unknown as AuthError };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    },
    [supabase, isConfigured],
  );

  /* ── Sign Up ──────────────────────────────────────────────────────────── */
  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      if (!isConfigured) return { error: new Error('Supabase não configurado') as unknown as AuthError };
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name || email },
          emailRedirectTo: `${appUrl}/auth/callback`,
        },
      });
      return { error };
    },
    [supabase, isConfigured],
  );

  /* ── Sign Out ─────────────────────────────────────────────────────────── */
  const signOut = useCallback(async () => {
    if (!isConfigured) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push('/');
  }, [supabase, router, isConfigured]);

  /* ── Value ────────────────────────────────────────────────────────────── */
  const value: AuthContextValue = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ── Hook ────────────────────────────────────────────────────────────────── */

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}

/* ── ProtectedRoute ──────────────────────────────────────────────────────── */

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#06080C]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3DF5C5] border-t-transparent" />
          <span className="font-mono text-sm text-[#7A8694]">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

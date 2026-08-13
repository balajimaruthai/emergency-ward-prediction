import { useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { UserRole } from '@/lib/types';

interface AuthState {
  loading: boolean;
  error: string | null;
}

interface LocalUser {
  id: string;
  email: string;
  role: UserRole;
  hospitalName?: string;
  fullName?: string;
  city?: string;
}

const LOCAL_USER_KEY = 'ewi-local-user';
const SELECTED_CITY_KEY = 'ewi-selected-city';

export interface AuthDetails {
  email?: string;
  password?: string;
  fullName?: string;
  hospitalName?: string;
  city?: string;
}

export function useAuth() {
  const [session, setSession] = useState<unknown>(null);
  const [user, setUser] = useState<User | LocalUser | null>(null);
  const [state, setState] = useState<AuthState>({
    loading: true,
    error: null,
  });

  useEffect(() => {
    let settled = false;

    const finish = (partial: Partial<AuthState>) => {
      if (settled) return;
      settled = true;
      setState((s) => ({ ...s, ...partial, loading: false }));
    };

    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        const localUser: LocalUser = JSON.parse(stored);
        setUser(localUser);
        setSession({ local: true });
        finish({});
        return;
      }
    } catch {
      // ignore
    }

    if (!isSupabaseConfigured) {
      finish({});
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
        finish({ error: error?.message ?? null });
      })
      .catch(() => finish({}));

    const timeout = window.setTimeout(() => finish({}), 3000);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sbSession) => {
      setSession(sbSession);
      setUser(sbSession?.user ?? null);
      setState({ loading: false, error: null });
    });

    return () => {
      window.clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInAsRole = useCallback(async (role: UserRole, details?: AuthDetails) => {
    setState({ loading: true, error: null });

    // Try Supabase for hospital accounts if configured
    if (isSupabaseConfigured && role === 'hospital' && details?.email && details?.password) {
      try {
        const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
          email: details.email,
          password: details.password,
        });
        if (!sbError && sbData?.user) {
          setState({ loading: false, error: null });
          return { error: null };
        }
        if (sbError) {
          // If Supabase returned an explicit error (e.g. invalid credentials)
          setState({ loading: false, error: sbError.message });
          return { error: sbError.message };
        }
      } catch (err: any) {
        // network or unexpected error
        setState({ loading: false, error: err?.message ?? 'Sign in failed' });
        return { error: err?.message ?? 'Sign in failed' };
      }
    }

    // Local session logic — restore saved hospital details if present
    let hospitalName = details?.hospitalName;
    let fullName = details?.fullName;
    let city = details?.city;

    try {
      const savedDetailsStr = localStorage.getItem('ewi-hospital-details');
      if (savedDetailsStr) {
        const savedDetails = JSON.parse(savedDetailsStr);
        if (!hospitalName) hospitalName = savedDetails.hospitalName;
        if (!fullName) fullName = savedDetails.fullName;
        if (!city) city = savedDetails.city;
      }
    } catch {
      // ignore
    }

    const localUser: LocalUser = {
      id: `user-${role}-${Date.now()}`,
      email: details?.email ?? `${role}@ewi.health`,
      role,
      hospitalName: hospitalName ?? 'Apollo Emergency Center',
      fullName: fullName ?? 'Dr. Staff Administrator',
      city: city ?? 'Chennai',
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    if (city) {
      localStorage.setItem(SELECTED_CITY_KEY, city);
    }
    setUser(localUser);
    setSession({ local: true });
    setState({ loading: false, error: null });
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password?: string) => {
    return signInAsRole('hospital', { email, password });
  }, [signInAsRole]);

  const signUp = useCallback(async (email: string, password?: string, details?: AuthDetails) => {
    setState({ loading: true, error: null });
    if (isSupabaseConfigured && email && password) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullName: details?.fullName,
              hospitalName: details?.hospitalName,
              city: details?.city,
            },
          },
        });
        if (error) {
          setState({ loading: false, error: error.message });
          return { error: error.message };
        }
      } catch {
        // fall through to local
      }
    }

    return signInAsRole('hospital', { email, password, ...details });
  }, [signInAsRole]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(LOCAL_USER_KEY);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setSession(null);
    setUser(null);
    setState({ loading: false, error: null });
  }, []);

  return {
    session,
    user,
    loading: state.loading,
    error: state.error,
    signIn,
    signUp,
    signInAsRole,
    signOut,
  };
}

export function getSelectedCity(): string | null {
  return localStorage.getItem(SELECTED_CITY_KEY);
}

export function setSelectedCity(city: string) {
  localStorage.setItem(SELECTED_CITY_KEY, city);
}

export function getCurrentRole(): UserRole | null {
  try {
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    if (stored) {
      const user = JSON.parse(stored) as LocalUser;
      return user.role;
    }
  } catch {
    // ignore
  }
  return null;
}

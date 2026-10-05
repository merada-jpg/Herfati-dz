import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type Profile = {
  id: string;
  role: 'customer' | 'artisan' | 'moderator' | 'admin';
  display_name: string;
  phone: string | null;
  wilaya_code: string | null;
  commune: string | null;
};

export async function signIn(email: string, password: string) {
  if (!supabase) return { error: 'Supabase Auth is not configured.' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUp(email: string, password: string, displayName: string) {
  if (!supabase) return { error: 'Supabase Auth is not configured.' };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName.trim() } },
  });
  if (error) return { error: error.message };
  if (!data.session) return { error: null, needsEmailConfirmation: true };
  return { error: null, needsEmailConfirmation: false };
}

export async function signOut() {
  if (!supabase) return { error: 'Supabase Auth is not configured.' };
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

export async function getProfile(user: User): Promise<Profile | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').select('id,role,display_name,phone,wilaya_code,commune').eq('id', user.id).maybeSingle();
  return data as Profile | null;
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

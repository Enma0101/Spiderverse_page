import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Track whether Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '%c⚠ Supabase no configurado',
    'color: orange; font-weight: bold',
    '\nCrea un archivo .env en la raíz del proyecto con:\n' +
    'VITE_SUPABASE_URL=tu_url\n' +
    'VITE_SUPABASE_ANON_KEY=tu_key\n' +
    '\nLa app funcionará en modo offline con datos locales.'
  );
}

// Create a real client if configured, or a dummy placeholder if not
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'implicit',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      lock: async (name, acquireTimeout, fn) => {
        return await fn();
      },
    },
  })
  : {
    // Dummy client that returns empty/null for all operations
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null, count: 0 }),
      insert: () => Promise.resolve({ data: null, error: null }),
      delete: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
      upsert: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      onAuthStateChange: (cb) => {
        // Fire once with null session so the app can initialize
        setTimeout(() => cb('INITIAL_SESSION', null), 0);
        return { data: { subscription: { unsubscribe: () => { } } } };
      },
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase no configurado' } }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    },
    storage: {
      from: () => ({
        getPublicUrl: (path) => ({ data: { publicUrl: '' } }),
      }),
    },
  };

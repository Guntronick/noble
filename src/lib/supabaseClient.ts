import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// NOTE: This client is for client-side (browser) use ONLY.
// It uses public environment variables and the public ANON key.
// For server-side data fetching, see `src/lib/data.ts`.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase public URL or Anon Key is missing from client-side environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

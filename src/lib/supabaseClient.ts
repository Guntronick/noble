import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// NOTE: This client is for client-side (browser) use ONLY.
// It uses public environment variables and the public ANON key.
// For server-side data fetching, see `src/lib/data.ts`.

// WARNING: Hardcoding credentials is not recommended for production.
// This is a temporary measure for the development environment.
const supabaseUrl = "https://dphbgqoqmyxcxsumgyjw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwaGJncW9xbXl4Y3hzdW1neWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNjQ1NjAsImV4cCI6MjA2NTg0MDU2MH0.uKbUXyUhgIBCpxDmSKf_OaQPrApnGjLwoTxJGFcH0u0";


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase public URL or Anon Key is missing from client-side environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

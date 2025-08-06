import { createClient } from '@supabase/supabase-js'

// ✅ Do NOT use `!` unless you are 100% sure the env vars exist.
// ✅ Add fallback or throw error for safety.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing!')
}

// Optional: Debug print
console.log('✅ Supabase URL:', supabaseUrl)
console.log('✅ Supabase Key (first 10):', supabaseAnonKey.substring(0, 10))

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // In the browser, we need to get these from window or use the actual values
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

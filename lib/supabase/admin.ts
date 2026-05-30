import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — initialized on first use so build-time static analysis
// doesn't fail when env vars are absent.
let _adminClient: SupabaseClient | null = null;

export const adminClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_adminClient) {
      _adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
    }
    const value = (_adminClient as any)[prop];
    return typeof value === "function" ? value.bind(_adminClient) : value;
  },
});

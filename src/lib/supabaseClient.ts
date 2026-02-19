import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Singleton client instance
let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Create a Supabase client instance for use in the browser.
 * This client uses public environment variables only.
 * It should only be used in Client Components.
 * 
 * The client is properly typed with the Database schema.
 * Uses singleton pattern to ensure realtime subscriptions work properly.
 */
export const createClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      }
    );
  }
  return supabaseInstance;
};

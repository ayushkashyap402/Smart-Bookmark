import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Create a Supabase client instance for use in the browser.
 * This client uses public environment variables only.
 * It should only be used in Client Components.
 * 
 * The client is properly typed with the Database schema.
 */
export const createClient = () => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

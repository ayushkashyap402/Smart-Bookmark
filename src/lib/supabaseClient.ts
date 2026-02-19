import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Define minimal database schema
export type Database = {
  public: {
    Tables: {
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          url?: string;
          created_at?: string;
        };
      };
    };
  };
};

// Cache the client instance to avoid creating multiple instances
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Create a single Supabase client instance for use in the browser.
 * This client uses public environment variables only.
 * It should only be used in Client Components.
 * 
 * The client is cached to prevent multiple instances which breaks realtime.
 */
export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
};

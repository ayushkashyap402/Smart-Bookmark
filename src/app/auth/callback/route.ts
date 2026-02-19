import { createClient } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

/**
 * Auth Callback Route Handler
 * Exchanges the OAuth code for a session and redirects to the dashboard.
 * Called by Supabase after successful OAuth sign-in.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to dashboard on successful authentication
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect to home on error
  return NextResponse.redirect(new URL("/", request.url));
}

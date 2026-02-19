"use client";

import { createClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoToDashboard = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // User is logged in, go to dashboard
        router.push("/dashboard");
      } else {
        // User not logged in, trigger Google OAuth
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          console.error("OAuth error:", error);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-6">
          <span className="text-7xl">🔖</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Smart Bookmarks
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Save, organize, and sync your bookmarks across all devices.
        </p>
        <p className="text-gray-600 mb-6">
          Sign in with Google to get started.
        </p>
        <button
          onClick={handleGoToDashboard}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <span>Get Started</span>
          )}
        </button>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Sync Across Devices
            </h3>
            <p className="text-sm text-gray-600">
              Access your bookmarks from any device with real-time updates.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Completely Private
            </h3>
            <p className="text-sm text-gray-600">
              Your bookmarks are encrypted and only visible to you.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Fast and Reliable
            </h3>
            <p className="text-sm text-gray-600">
              Powered by Supabase with instant updates.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

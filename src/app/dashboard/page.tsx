"use client";

import { createClient } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkList from "@/components/BookmarkList";

/**
 * Dashboard Page
 * Main application page for authenticated users.
 * Shows add bookmark form and bookmark list with real-time updates.
 */
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    const getSession = async () => {
      const supabase = createClient();

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          // Redirect to home if not authenticated
          router.push("/");
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleBookmarkAdded = () => {
    // Trigger a refresh of the bookmark list
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Dashboard</h1>
          <p className="text-gray-600">Manage and organize your bookmarks</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Bookmark Form - Left Column (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>➕</span> Add Bookmark
              </h2>
              <AddBookmarkForm
                user={user}
                onBookmarkAdded={handleBookmarkAdded}
              />
            </div>
          </div>

          {/* Bookmark List - Right Column */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <BookmarkList user={user} refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Footer Info */}
        {user && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
              <span>⚡</span>
              <span>Bookmarks are synced in real-time across all your devices</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

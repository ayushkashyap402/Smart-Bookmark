"use client";

import { createClient } from "@/lib/supabaseClient";
import type { Tables } from "@/types/database";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type Bookmark = Tables<"bookmarks">;

interface BookmarkListProps {
  user: User | null;
  refreshTrigger: number;
}

/**
 * BookmarkList Component
 * Displays user bookmarks with delete functionality and realtime updates.
 * Uses Supabase realtime to sync data across tabs.
 */
export default function BookmarkList({
  user,
  refreshTrigger,
}: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch bookmarks for current user
  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setBookmarks(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch bookmarks";
      setError(message);
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookmarks on mount and when user changes
  useEffect(() => {
    fetchBookmarks();
  }, [user?.id, refreshTrigger]);

  // Setup realtime subscription for real-time updates across tabs
  useEffect(() => {
    if (!user) return;

    const supabase = createClient();

    console.log("🔌 Setting up realtime subscription for user:", user.id);

    // Subscribe to changes on the bookmarks table
    const channel = supabase
      .channel(`bookmarks-${user.id}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`, // Only listen to current user's bookmarks
        },
        (payload: any) => {
          console.log("🔥 Realtime event received:", payload.eventType, payload);
          
          // Handle INSERT
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => {
              // Avoid duplicates
              if (prev.some(b => b.id === payload.new.id)) {
                console.log("Duplicate INSERT ignored");
                return prev;
              }
              console.log("Adding new bookmark:", payload.new);
              return [payload.new, ...prev];
            });
          }
          // Handle DELETE
          else if (payload.eventType === "DELETE") {
            const deletedId = payload.old?.id;
            console.log("Deleting bookmark:", deletedId);
            if (deletedId) {
              setBookmarks((prev) => {
                const filtered = prev.filter((b) => b.id !== deletedId);
                console.log("Bookmarks after delete:", filtered.length);
                return filtered;
              });
            }
          }
          // Handle UPDATE
          else if (payload.eventType === "UPDATE") {
            console.log("Updating bookmark:", payload.new);
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to realtime updates");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Realtime subscription error");
        } else if (status === "TIMED_OUT") {
          console.error("⏱️ Realtime subscription timed out");
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("🔌 Unsubscribing from realtime");
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleDelete = async (bookmarkId: string) => {
    setDeletingId(bookmarkId);
    setError(null);

    try {
      const supabase = createClient();

      // Optimistically remove from UI immediately
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));

      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId)
        .eq("user_id", user?.id || "");

      if (deleteError) {
        // Revert on error by refetching
        await fetchBookmarks();
        throw deleteError;
      }

      console.log("✅ Bookmark deleted successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete bookmark";
      setError(message);
      console.error("❌ Error deleting bookmark:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">Sign in to view your bookmarks</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error && bookmarks.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchBookmarks}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <p className="text-blue-800 mb-2">No bookmarks yet</p>
        <p className="text-blue-600 text-sm">
          Add your first bookmark using the form above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">
        Your Bookmarks ({bookmarks.length})
      </h2>

      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="group flex items-start justify-between p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                {bookmark.title}
              </p>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm truncate block mb-2"
              >
                {bookmark.url}
              </a>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span>📅</span>
                {new Date(bookmark.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={deletingId === bookmark.id}
              className="ml-4 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 disabled:opacity-50 font-bold text-lg"
              title="Delete bookmark"
            >
              {deletingId === bookmark.id ? "⏳" : "✕"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

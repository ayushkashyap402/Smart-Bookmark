"use client";

import { createClient } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

// Define database types
interface Database {
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
}

interface AddBookmarkFormProps {
  user: User | null;
  onBookmarkAdded: () => void;
}

/**
 * AddBookmarkForm Component
 * Form to add new bookmarks (title + url).
 * Validates URL format before submission.
 */
export default function AddBookmarkForm({
  user,
  onBookmarkAdded,
}: AddBookmarkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate URL format
  const isValidUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return ["http:", "https:"].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const validateForm = (): string | null => {
    if (!title.trim()) return "Title is required";
    if (!url.trim()) return "URL is required";
    if (!isValidUrl(url)) {
      return "Please enter a valid URL (e.g., https://example.com)";
    }
    if (title.trim().length > 255) return "Title must be less than 255 characters";
    if (url.trim().length > 2048) return "URL must be less than 2048 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) {
      setError("You must be logged in to add bookmarks");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Insert bookmark into database
      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert({
          user_id: user.id,
          title: title.trim(),
          url: url.trim(),
        });

      if (insertError) {
        setError(insertError.message || "Failed to add bookmark");
        console.error("Insert error:", insertError);
        return;
      }

      // Clear form & show success
      setTitle("");
      setUrl("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Notify parent component to refresh
      onBookmarkAdded();
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Error adding bookmark:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-800">
          Please sign in with Google to add bookmarks
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          📝 Bookmark Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 255))}
          placeholder="e.g., React Documentation"
          maxLength={255}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white disabled:bg-gray-100 transition-all"
          disabled={loading}
          aria-describedby="title-helper"
        />
        <p id="title-helper" className="text-xs text-gray-500 mt-1.5 flex justify-between">
          <span>Give your bookmark a memorable name</span>
          <span className="font-medium">{title.length}/255</span>
        </p>
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
          🔗 URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g., https://react.dev"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white disabled:bg-gray-100 transition-all"
          disabled={loading}
          aria-describedby="url-error"
        />
      </div>

      {error && (
        <div id="url-error" className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg text-sm flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-lg text-sm flex items-center gap-2 animate-pulse">
          <span className="text-lg">✅</span>
          <span>Bookmark added successfully!</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
      >
        {loading ? "⏳ Adding..." : "➕ Add Bookmark"}
      </button>
    </form>
  );
}
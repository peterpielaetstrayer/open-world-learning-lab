"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let instance: SupabaseClient | null = null;

/**
 * Browser uses only the PUBLIC publishable key.
 * Authorization is enforced separately by Supabase RLS and grants.
 */
export function browserSupabase(): SupabaseClient {
  if (instance) return instance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishable) {
    throw new Error(
      "Project Launch Lab authentication is not configured yet. The Supabase URL and publishable key must be configured in the deployment environment."
    );
  }
  instance = createBrowserClient(url, publishable);
  return instance;
}

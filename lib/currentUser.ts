import { supabase } from "./supabase";

export async function requireCurrentUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id ?? null;

  if (!userId) {
    throw new Error("Auth session missing!");
  }

  return userId;
}
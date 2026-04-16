import { supabase } from "./supabase";

export async function requireCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  return user.id;
}
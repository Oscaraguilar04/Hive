import { supabase } from "./supabase";

export async function signUpWithEmail(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signInWithEmail(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOutUser() {
  return await supabase.auth.signOut();
}

export async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}
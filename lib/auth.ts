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

export async function signUpThenSignIn(email: string, password: string) {
  const signUpResult = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpResult.error) {
    return { error: signUpResult.error };
  }

  const signInResult = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInResult.error) {
    return { error: signInResult.error };
  }

  return { error: null };
}

export async function waitForSession(maxAttempts = 10, delayMs = 300) {
  for (let i = 0; i < maxAttempts; i += 1) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.id) {
      return session;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return null;
}

export async function signOutUser() {
  return await supabase.auth.signOut();
}
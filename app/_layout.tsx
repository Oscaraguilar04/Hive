import type { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthScreen = (segments as string[]).includes("login");

    if (!session && !inAuthScreen) {
      router.replace("/login" as any);
      return;
    }

    if (session && inAuthScreen) {
      router.replace("/" as any);
    }
  }, [session, loading, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
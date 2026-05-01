import type { Session } from "@supabase/supabase-js";
import { Redirect, Stack, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

export default function Layout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#5A6BFF" />
      </SafeAreaView>
    );
  }

  const firstSegment = (segments as string[])[0];
  const publicRoutes = ["index", "login", "signup"];
  const inPublicRoute = !firstSegment || publicRoutes.includes(firstSegment);

  if (!session && !inPublicRoute) {
    return <Redirect href={"/login" as any} />;
  }

  if (session && (firstSegment === "login" || firstSegment === "signup" || !firstSegment)) {
    return <Redirect href={"/home" as any} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050816",
    justifyContent: "center",
    alignItems: "center",
  },
});
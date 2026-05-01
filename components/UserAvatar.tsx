import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getMyProfile } from "../lib/profile";

type UserAvatarProps = {
  size?: number;
};

export default function UserAvatar({ size = 34 }: UserAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const loadAvatar = useCallback(async () => {
    try {
      const profile = await getMyProfile();
      setAvatarUrl(profile?.avatar_url ?? null);
    } catch {
      setAvatarUrl(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAvatar();
    }, [loadAvatar])
  );

  if (!avatarUrl) {
    return (
      <View
        style={[
          styles.fallback,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Text style={styles.fallbackText}>H</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: avatarUrl }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "#2A2A30",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
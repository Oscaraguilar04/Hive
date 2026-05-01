import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import UserAvatar from "../components/UserAvatar";
import {
  getMyProfile,
  pickImageFromLibrary,
  updateMyProfile,
  uploadAvatarAsync,
} from "../lib/profile";

export default function ProfileScreen() {
  const [fullName, setFullName] = useState("Hive User");
  const [bio, setBio] = useState("Discovering the best events nearby.");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProfile = async () => {
    try {
      const profile = await getMyProfile();
      if (!profile) return;

      setFullName(profile.full_name ?? "Hive User");
      setBio(profile.bio ?? "Discovering the best events nearby.");
      setAvatarUrl(profile.avatar_url ?? null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not load profile.";
      Alert.alert("Profile error", message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handlePickAvatar = async () => {
    try {
      const localUri = await pickImageFromLibrary();

      if (!localUri) return;

      setSaving(true);
      const publicUrl = await uploadAvatarAsync(localUri);
      setAvatarUrl(publicUrl);
      Alert.alert("Success", "Profile photo updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update profile photo.";
      Alert.alert("Upload error", message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateMyProfile({
        full_name: fullName,
        bio,
      });
      Alert.alert("Saved", "Profile updated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save profile.";
      Alert.alert("Save error", message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerImageWrap}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
            }}
            style={styles.headerImage}
          />

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>

          <Pressable style={styles.settingsButton}>
            <Ionicons name="settings-sharp" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.avatarWrap}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.largeAvatar} />
          ) : (
            <View style={styles.largeFallback}>
              <Text style={styles.largeFallbackText}>H</Text>
            </View>
          )}

          <Pressable style={styles.avatarEditButton} onPress={handlePickAvatar}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        <TextInput
          value={fullName}
          onChangeText={setFullName}
          style={styles.nameInput}
          placeholder="Your name"
          placeholderTextColor="#7F7F86"
        />

        <TextInput
          value={bio}
          onChangeText={setBio}
          style={styles.bioInput}
          placeholder="Add a short bio"
          placeholderTextColor="#7F7F86"
          multiline
        />

        <Pressable
          style={[styles.primaryButton, saving && styles.disabled]}
          onPress={handleSaveProfile}
          disabled={saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? "Saving..." : "Save Profile"}
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push("/home" as any)}>
          <Ionicons name="home-outline" size={22} color="#F3F3F5" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/discover" as any)}>
          <Ionicons name="compass-outline" size={22} color="#F3F3F5" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/create" as any)}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/map" as any)}>
          <Ionicons name="map-outline" size={22} color="#F3F3F5" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={() => router.push("/profile" as any)}>
          <View style={styles.activeIndicator} />
          <UserAvatar size={28} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#111113",
  },
  contentContainer: {
    paddingBottom: 110,
  },
  headerImageWrap: {
    height: 220,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 18,
    width: 46,
    height: 46,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 18,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrap: {
    alignSelf: "center",
    marginTop: -70,
    marginBottom: 18,
    position: "relative",
  },
  largeAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#111113",
  },
  largeFallback: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#111113",
    backgroundColor: "#2A2A30",
    alignItems: "center",
    justifyContent: "center",
  },
  largeFallbackText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
  },
  avatarEditButton: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6E7BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  nameInput: {
    marginHorizontal: 24,
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },
  bioInput: {
    marginHorizontal: 24,
    color: "#CFCFD4",
    fontSize: 14,
    textAlign: "center",
    minHeight: 70,
    marginBottom: 18,
  },
  primaryButton: {
    marginHorizontal: 24,
    backgroundColor: "#F4F4F5",
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 84,
    backgroundColor: "#08080B",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 14,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 28,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#6E7BFF",
  },
});
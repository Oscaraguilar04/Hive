import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./supabase";

export type ProfileRow = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export async function getCurrentUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("No authenticated user found.");
  }

  return userId;
}

export async function ensureProfile() {
  const userId = await getCurrentUserId();

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (!existing) {
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: userId,
        full_name: "Hive User",
        bio: "Discovering the best events nearby.",
        avatar_url: null,
      },
    ]);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  return userId;
}

export async function getMyProfile(): Promise<ProfileRow | null> {
  const userId = await ensureProfile();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, bio, avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProfileRow;
}

export async function updateMyProfile(updates: {
  full_name?: string;
  bio?: string;
  avatar_url?: string | null;
}) {
  const userId = await ensureProfile();

  const { error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function pickImageFromLibrary() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error("Media library permission is required.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  return result.assets[0].uri;
}

export async function uploadAvatarAsync(localUri: string) {
  const userId = await ensureProfile();

  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const arrayBuffer = decode(base64);
  const filePath = `${userId}/avatar.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, arrayBuffer, {
      upsert: true,
      contentType: "image/jpeg",
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

  await updateMyProfile({ avatar_url: publicUrl });

  return publicUrl;
}
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { requireCurrentUserId } from "../lib/currentUser";
import { geocodeVenueAddress } from "../lib/geocoding";
import { supabase } from "../lib/supabase";

const CATEGORY_OPTIONS = [
  "Music",
  "Food",
  "Comedy",
  "Nightlife",
  "Outdoors",
  "Sports",
  "Community",
];

const AGE_OPTIONS = ["All Ages", "18+", "21+"];

const STATE_OPTIONS = ["CA", "NV", "AZ"];

export default function CreateScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Music");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("CA");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agePolicy, setAgePolicy] = useState("All Ages");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to upload an event image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadEventImage = async (localUri: string) => {
    const response = await fetch(localUri);
    const blob = await response.blob();

    const userId = await requireCurrentUserId();
    const fileExt = localUri.split(".").pop() || "jpg";
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `event-flyers/${fileName}`;

    const { error } = await supabase.storage
      .from("event-images")
      .upload(filePath, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from("event-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCreateEvent = async () => {
    if (
      !title ||
      !category ||
      !city ||
      !stateValue ||
      !address ||
      !date ||
      !time ||
      !description
    ) {
      Alert.alert("Missing info", "Please fill out all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Location permission needed",
          "We use address geocoding to place your event on the map."
        );
        setSubmitting(false);
        return;
      }

      const userId = await requireCurrentUserId();

      let imageUrl =
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80";

      if (imageUri) {
        imageUrl = await uploadEventImage(imageUri);
      }

      const { latitude, longitude } = await geocodeVenueAddress({
        address,
        city,
        state: stateValue,
      });

      const dateLabel = `${date} • ${time}`;
      const locationLabel = `${address}, ${city}, ${stateValue}`;

      const { error } = await supabase.from("events").insert({
        title,
        category,
        date_label: dateLabel,
        location: locationLabel,
        city,
        state: stateValue,
        address,
        age_policy: agePolicy,
        description,
        image: imageUrl,
        creator_id: userId,
        featured: false,
        interested: 0,
        latitude,
        longitude,
      });

      if (error) {
        throw new Error(error.message);
      }

      Alert.alert("Success", "Your event was created.");

      setTitle("");
      setCategory("Music");
      setCity("");
      setStateValue("CA");
      setAddress("");
      setDate("");
      setTime("");
      setAgePolicy("All Ages");
      setDescription("");
      setImageUri(null);

      router.push("/home" as any);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong creating the event.";
      Alert.alert("Create event error", message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerRow}>
              <Pressable onPress={() => router.back()}>
                <Text style={styles.backArrow}>‹</Text>
              </Pressable>

              <Text style={styles.headerTitle}>CREATE YOUR OWN EVENT</Text>

              <View style={styles.headerSpacer} />
            </View>

            <Text style={styles.subtitle}>
              Bring your community together and let people discover your event.
            </Text>

            <Pressable style={styles.imageUploadBox} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.imagePlaceholderWrap}>
                  <Text style={styles.cameraIcon}>⌁</Text>
                  <Text style={styles.imagePlaceholderText}>ADD COVER IMAGE</Text>
                  <Text style={styles.imagePlaceholderSubtext}>
                    Upload flyer or event photo
                  </Text>
                </View>
              )}
            </Pressable>

            <Text style={styles.label}>EVENT TITLE</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Sunset Rooftop Set"
              placeholderTextColor="#6D6D6D"
              style={styles.input}
            />

            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.chipWrap}>
              {CATEGORY_OPTIONS.map((option) => {
                const active = category === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setCategory(option)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>CITY</Text>
            <TextInput
              value={city}
              onChangeText={setCity}
              placeholder="Bakersfield"
              placeholderTextColor="#6D6D6D"
              style={styles.input}
            />

            <Text style={styles.label}>STATE</Text>
            <View style={styles.chipWrap}>
              {STATE_OPTIONS.map((option) => {
                const active = stateValue === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setStateValue(option)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>VENUE / ADDRESS</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="3939 W 102nd St"
              placeholderTextColor="#6D6D6D"
              style={styles.input}
            />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>DATE</Text>
                <TextInput
                  value={date}
                  onChangeText={setDate}
                  placeholder="Apr 28"
                  placeholderTextColor="#6D6D6D"
                  style={styles.input}
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.label}>TIME</Text>
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="8:00 PM"
                  placeholderTextColor="#6D6D6D"
                  style={styles.input}
                />
              </View>
            </View>

            <Text style={styles.label}>AGE POLICY</Text>
            <View style={styles.chipWrap}>
              {AGE_OPTIONS.map((option) => {
                const active = agePolicy === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setAgePolicy(option)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Tell people what makes your event worth showing up for."
              placeholderTextColor="#6D6D6D"
              style={[styles.input, styles.textArea]}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={[styles.createButton, submitting && styles.disabledButton]}
              onPress={handleCreateEvent}
              disabled={submitting}
            >
              <Text style={styles.createButtonText}>
                {submitting ? "CREATING..." : "PUBLISH EVENT"}
              </Text>
            </Pressable>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 80,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backArrow: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "400",
    width: 28,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 28,
  },
  subtitle: {
    color: "#B6B6B6",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 22,
    textAlign: "center",
  },
  imageUploadBox: {
    height: 220,
    borderWidth: 1,
    borderColor: "#8A8A8A",
    marginBottom: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#111111",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholderWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    color: "#3F3F3F",
    fontSize: 30,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    color: "#BDBDBD",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  imagePlaceholderSubtext: {
    color: "#6D6D6D",
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#8A8A8A",
    backgroundColor: "#0A0A0A",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  textArea: {
    minHeight: 150,
    paddingTop: 14,
    marginBottom: 28,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#8A8A8A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#0A0A0A",
  },
  chipActive: {
    backgroundColor: "#F2F2F2",
    borderColor: "#F2F2F2",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  chipTextActive: {
    color: "#111111",
  },
  createButton: {
    marginTop: 8,
    backgroundColor: "#F2F2F2",
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
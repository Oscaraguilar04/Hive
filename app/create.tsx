import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function CreateScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePostEvent = async () => {
    if (!title || !category || !dateLabel || !location) {
      Alert.alert("Missing info", "Please fill in title, category, date/time, and location.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("events").insert([
      {
        title,
        category,
        date_label: dateLabel,
        location,
        interested: 0,
        image:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
        featured: false,
      },
    ]);

    setSubmitting(false);

    if (error) {
      Alert.alert("Could not post event", error.message);
      return;
    }

    Alert.alert("Success", "Event posted.");
    setTitle("");
    setCategory("");
    setDateLabel("");
    setLocation("");
    setDescription("");
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Event</Text>
        <Text style={styles.subtitle}>Post something people will want to go to</Text>

        <Pressable
          style={styles.imageUploadCard}
          onPress={() => Alert.alert("Upload", "Real image upload comes later")}
        >
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
            }}
            style={styles.imageUploadBackground}
            imageStyle={styles.imageUploadStyle}
          >
            <View style={styles.imageOverlay} />
            <Text style={styles.imageUploadText}>Tap to change cover image</Text>
          </ImageBackground>
        </Pressable>

        <View style={styles.formCard}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Event title"
            placeholderTextColor="#7F89B0"
            style={styles.input}
          />
          <TextInput
            value={category}
            onChangeText={setCategory}
            placeholder="Category"
            placeholderTextColor="#7F89B0"
            style={styles.input}
          />
          <TextInput
            value={dateLabel}
            onChangeText={setDateLabel}
            placeholder="Date and time"
            placeholderTextColor="#7F89B0"
            style={styles.input}
          />
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor="#7F89B0"
            style={styles.input}
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor="#7F89B0"
            style={[styles.input, styles.textArea]}
            multiline
          />

          <Pressable
            style={[styles.postButton, submitting && styles.postButtonDisabled]}
            onPress={handlePostEvent}
            disabled={submitting}
          >
            <Text style={styles.postButtonText}>
              {submitting ? "Posting..." : "Post Event"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050816",
  },
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    color: "#98A2C7",
    fontSize: 16,
    marginBottom: 18,
  },
  imageUploadCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 18,
  },
  imageUploadBackground: {
    height: 190,
    justifyContent: "flex-end",
    padding: 16,
  },
  imageUploadStyle: {
    borderRadius: 24,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 10, 22, 0.28)",
  },
  imageUploadText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  formCard: {
    backgroundColor: "#0B1124",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#18213F",
    padding: 14,
  },
  input: {
    backgroundColor: "#10162A",
    borderWidth: 1,
    borderColor: "#1A2340",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 15,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  postButton: {
    backgroundColor: "#5A6BFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  postButtonDisabled: {
    opacity: 0.7,
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
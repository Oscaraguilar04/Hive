import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { requireCurrentUserId } from "../lib/currentUser";
import { supabase } from "../lib/supabase";

type EventItem = {
  id: string;
  title: string;
  date_label: string;
  location: string;
  interested: number;
  category: string;
  image: string;
  featured?: boolean;
  created_at?: string;
};

type InterestRow = {
  status: "interested" | "going";
};

export default function EventDetailsScreen() {
  const params = useLocalSearchParams<{ eventId?: string }>();
  const eventId = params.eventId ?? "";

  const [event, setEvent] = useState<EventItem | null>(null);
  const [interested, setInterested] = useState(false);
  const [saved, setSaved] = useState(false);
  const [going, setGoing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchEvent(), loadEventState()]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong loading this event.";
      Alert.alert("Event error", message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    setEvent(data as EventItem);
  };

  const loadEventState = async () => {
    const userId = await requireCurrentUserId();

    const { data: savedData, error: savedError } = await supabase
      .from("saved_events")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId);

    if (savedError) {
      throw new Error(savedError.message);
    }

    setSaved((savedData?.length ?? 0) > 0);

    const { data: interestData, error: interestError } = await supabase
      .from("event_interests")
      .select("status")
      .eq("user_id", userId)
      .eq("event_id", eventId);

    if (interestError) {
      throw new Error(interestError.message);
    }

    const statuses = ((interestData as InterestRow[]) || []).map((row) => row.status);
    setInterested(statuses.includes("interested"));
    setGoing(statuses.includes("going"));
  };

  const toggleSave = async () => {
    if (!eventId) return;

    try {
      const userId = await requireCurrentUserId();

      if (saved) {
        const { error } = await supabase
          .from("saved_events")
          .delete()
          .eq("user_id", userId)
          .eq("event_id", eventId);

        if (error) {
          Alert.alert("Could not unsave event", error.message);
          return;
        }

        setSaved(false);
        return;
      }

      const { error } = await supabase.from("saved_events").insert([
        {
          user_id: userId,
          event_id: eventId,
        },
      ]);

      if (error) {
        Alert.alert("Could not save event", error.message);
        return;
      }

      setSaved(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong saving this event.";
      Alert.alert("Save error", message);
    }
  };

  const toggleInterested = async () => {
    if (!eventId) return;

    try {
      const userId = await requireCurrentUserId();

      if (interested) {
        const { error } = await supabase
          .from("event_interests")
          .delete()
          .eq("user_id", userId)
          .eq("event_id", eventId)
          .eq("status", "interested");

        if (error) {
          Alert.alert("Could not remove interest", error.message);
          return;
        }

        setInterested(false);
        return;
      }

      const { error } = await supabase.from("event_interests").insert([
        {
          user_id: userId,
          event_id: eventId,
          status: "interested",
        },
      ]);

      if (error) {
        Alert.alert("Could not mark interested", error.message);
        return;
      }

      setInterested(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong updating interest.";
      Alert.alert("Interest error", message);
    }
  };

  const toggleGoing = async () => {
    if (!eventId) return;

    try {
      const userId = await requireCurrentUserId();

      if (going) {
        const { error } = await supabase
          .from("event_interests")
          .delete()
          .eq("user_id", userId)
          .eq("event_id", eventId)
          .eq("status", "going");

        if (error) {
          Alert.alert("Could not remove going status", error.message);
          return;
        }

        setGoing(false);
        return;
      }

      const { error } = await supabase.from("event_interests").insert([
        {
          user_id: userId,
          event_id: eventId,
          status: "going",
        },
      ]);

      if (error) {
        Alert.alert("Could not mark going", error.message);
        return;
      }

      setGoing(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong updating going status.";
      Alert.alert("Going error", message);
    }
  };

  if (!eventId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.loadingText}>No event selected.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.loadingText}>Loading event...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.loadingText}>Event not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: event.image }}
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <View style={styles.heroOverlay} />

          <View style={styles.topRow}>
            <Pressable style={styles.topIconButton} onPress={() => router.back()}>
              <Text style={styles.topIconText}>←</Text>
            </Pressable>

            <Pressable
              style={styles.topIconButton}
              onPress={() => Alert.alert("Share", "Share feature later")}
            >
              <Text style={styles.topIconText}>↗</Text>
            </Pressable>
          </View>

          <View style={styles.heroBottom}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>
                {event.featured ? "🔥 Tonight’s Highlight" : "🎉 Event"}
              </Text>
            </View>

            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventSubtitle}>
              {event.location} • {event.date_label}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.contentCard}>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{event.date_label}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{event.category}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Interested</Text>
              <Text style={styles.infoValue}>{event.interested} People</Text>
            </View>
          </View>

          <View style={styles.organizerCard}>
            <View style={styles.organizerAvatar}>
              <Text style={styles.organizerAvatarText}>HV</Text>
            </View>

            <View style={styles.organizerTextWrap}>
              <Text style={styles.organizerName}>Hive Organizer</Text>
              <Text style={styles.organizerMeta}>Organizer • Local events</Text>
            </View>

            <Pressable
              style={styles.followButton}
              onPress={() => Alert.alert("Followed", "Organizer follow comes later")}
            >
              <Text style={styles.followButtonText}>Follow</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>
              This event is live in your Hive feed. Later, this section can hold the real event
              description written by the organizer. For now, you’ve got full backend actions wired
              to this event.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What to expect</Text>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🎟️ Live Event</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>📍 Local</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🔥 Popular</Text>
              </View>
            </View>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🎉 Social</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>📱 On Hive</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              <Text style={styles.locationTitle}>{event.location}</Text>
              <Text style={styles.locationText}>Full address support comes later.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.secondaryAction, interested && styles.secondaryActionActive]}
          onPress={toggleInterested}
        >
          <Text style={styles.secondaryActionText}>
            {interested ? "Interested ✓" : "Interested"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.iconAction, saved && styles.iconActionActive]}
          onPress={toggleSave}
        >
          <Text style={styles.iconActionText}>{saved ? "🔖" : "📑"}</Text>
        </Pressable>

        <Pressable
          style={[styles.primaryAction, going && styles.primaryActionActive]}
          onPress={toggleGoing}
        >
          <Text style={styles.primaryActionText}>{going ? "Going ✓" : "Going"}</Text>
        </Pressable>
      </View>
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  contentContainer: {
    paddingBottom: 120,
  },
  heroImage: {
    height: 360,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  heroImageStyle: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 8, 22, 0.28)",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(10, 15, 31, 0.82)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  topIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  heroBottom: {
    marginTop: "auto",
  },
  liveBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(91, 108, 255, 0.95)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  liveBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  eventTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 6,
  },
  eventSubtitle: {
    color: "#E0E5FA",
    fontSize: 16,
    fontWeight: "600",
  },
  contentCard: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  infoBox: {
    width: "48.5%",
    backgroundColor: "#0B1124",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#18213F",
  },
  infoLabel: {
    color: "#8E99BE",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  organizerCard: {
    backgroundColor: "#0B1124",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#18213F",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  organizerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#5B6CFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  organizerAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  organizerTextWrap: {
    flex: 1,
  },
  organizerName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  organizerMeta: {
    color: "#97A1C6",
    fontSize: 13,
    fontWeight: "600",
  },
  followButton: {
    backgroundColor: "#1C2650",
    borderWidth: 1,
    borderColor: "#32407A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },
  description: {
    color: "#C8D0EE",
    fontSize: 15,
    lineHeight: 24,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#10162A",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#1A2340",
  },
  tagText: {
    color: "#E7EBFF",
    fontSize: 14,
    fontWeight: "700",
  },
  locationCard: {
    backgroundColor: "#0B1124",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#18213F",
  },
  locationTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  locationText: {
    color: "#A7B0D2",
    fontSize: 15,
    lineHeight: 22,
  },
  bottomBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 18,
    backgroundColor: "rgba(10, 15, 31, 0.97)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1B2444",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  secondaryAction: {
    backgroundColor: "#151D37",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#263256",
  },
  secondaryActionActive: {
    backgroundColor: "#243A94",
    borderColor: "#4D6BFF",
  },
  secondaryActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  iconAction: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#151D37",
    borderWidth: 1,
    borderColor: "#263256",
    justifyContent: "center",
    alignItems: "center",
  },
  iconActionActive: {
    backgroundColor: "#243A94",
    borderColor: "#4D6BFF",
  },
  iconActionText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: "#5A6BFF",
    borderRadius: 16,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryActionActive: {
    backgroundColor: "#3E50F0",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
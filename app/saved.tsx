import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";
import { requireCurrentUserId } from "../lib/currentUser";

type TabType = "Going" | "Saved";

type EventRow = {
  id: string;
  title: string;
  date_label: string;
  location: string;
  image: string;
};

type SavedJoinRow = {
  id: string;
  event_id: string;
  events: EventRow | EventRow[] | null;
};

type InterestJoinRow = {
  id: string;
  event_id: string;
  status: "interested" | "going";
  events: EventRow | EventRow[] | null;
};

export default function SavedScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("Going");
  const [goingEvents, setGoingEvents] = useState<EventRow[]>([]);
  const [savedEvents, setSavedEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeEvent = useCallback((value: EventRow | EventRow[] | null): EventRow | null => {
    if (!value) return null;
    if (Array.isArray(value)) return value[0] ?? null;
    return value;
  }, []);

  const fetchGoingEvents = useCallback(async () => {
    const userId = await requireCurrentUserId();

    const { data, error } = await supabase
      .from("event_interests")
      .select(
        `
        id,
        event_id,
        status,
        events (
          id,
          title,
          date_label,
          location,
          image
        )
      `
      )
      .eq("user_id", userId)
      .eq("status", "going");

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data as InterestJoinRow[]) || [];
    const normalized = rows
      .map((row) => normalizeEvent(row.events))
      .filter((event): event is EventRow => Boolean(event));

    setGoingEvents(normalized);
  }, [normalizeEvent]);

  const fetchSavedEvents = useCallback(async () => {
    const userId = await requireCurrentUserId();

    const { data, error } = await supabase
      .from("saved_events")
      .select(
        `
        id,
        event_id,
        events (
          id,
          title,
          date_label,
          location,
          image
        )
      `
      )
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    const rows = (data as SavedJoinRow[]) || [];
    const normalized = rows
      .map((row) => normalizeEvent(row.events))
      .filter((event): event is EventRow => Boolean(event));

    setSavedEvents(normalized);
  }, [normalizeEvent]);

  const loadSavedScreenData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchGoingEvents(), fetchSavedEvents()]);
    } catch (error) {
      console.error("Error loading saved screen data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchGoingEvents, fetchSavedEvents]);

  useEffect(() => {
    loadSavedScreenData();
  }, [loadSavedScreenData]);

  const currentList = activeTab === "Going" ? goingEvents : savedEvents;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Plans</Text>
          <Text style={styles.subtitle}>Keep track of what you’re going to and saving</Text>
        </View>

        <View style={styles.tabWrap}>
          <Pressable
            style={[styles.tabButton, activeTab === "Going" && styles.tabButtonActive]}
            onPress={() => setActiveTab("Going")}
          >
            <Text style={[styles.tabText, activeTab === "Going" && styles.tabTextActive]}>
              Going
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabButton, activeTab === "Saved" && styles.tabButtonActive]}
            onPress={() => setActiveTab("Saved")}
          >
            <Text style={[styles.tabText, activeTab === "Saved" && styles.tabTextActive]}>
              Saved
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === "Going" ? "🔥 Going Soon" : "⭐ Saved for Later"}
          </Text>
          <Text style={styles.sectionCount}>
            {loading ? "Loading..." : `${currentList.length} events`}
          </Text>
        </View>

        {!loading && currentList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {activeTab === "Going" ? "No going events yet" : "No saved events yet"}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === "Going"
                ? "Mark an event as going and it will appear here."
                : "Save an event from Home and it will appear here."}
            </Text>
          </View>
        ) : null}

        {currentList.map((event) => (
          <Pressable key={event.id} style={styles.eventCard}>
            <ImageBackground
              source={{ uri: event.image }}
              style={styles.eventImage}
              imageStyle={styles.eventImageStyle}
            >
              <View style={styles.imageOverlay} />
            </ImageBackground>

            <View style={styles.eventBody}>
              <View style={styles.eventTextWrap}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>{event.date_label}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>

              <View style={styles.statusWrap}>
                <View
                  style={[
                    styles.statusBadge,
                    activeTab === "Going" ? styles.goingBadge : styles.savedBadge,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {activeTab === "Going" ? "Going" : "Saved"}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
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
  header: {
    marginBottom: 20,
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
    lineHeight: 22,
  },
  tabWrap: {
    flexDirection: "row",
    backgroundColor: "#0E1327",
    borderRadius: 18,
    padding: 6,
    borderWidth: 1,
    borderColor: "#1A2340",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#5A6BFF",
  },
  tabText: {
    color: "#95A0C6",
    fontSize: 15,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  sectionCount: {
    color: "#8F99BE",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    backgroundColor: "#0B1124",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#18213F",
    padding: 18,
    marginBottom: 14,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },
  emptyText: {
    color: "#98A2C7",
    fontSize: 14,
    lineHeight: 22,
  },
  eventCard: {
    backgroundColor: "#0B1124",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#18213F",
  },
  eventImage: {
    height: 155,
  },
  eventImageStyle: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 10, 22, 0.18)",
  },
  eventBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  eventTextWrap: {
    flex: 1,
  },
  eventTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  eventMeta: {
    color: "#D8DDF2",
    fontSize: 15,
    marginBottom: 4,
  },
  eventLocation: {
    color: "#95A0C6",
    fontSize: 14,
  },
  statusWrap: {
    justifyContent: "center",
  },
  statusBadge: {
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  goingBadge: {
    backgroundColor: "#243A94",
    borderWidth: 1,
    borderColor: "#4D6BFF",
  },
  savedBadge: {
    backgroundColor: "#1B2240",
    borderWidth: 1,
    borderColor: "#32407A",
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
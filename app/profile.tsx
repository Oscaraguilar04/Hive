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
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { signOutUser } from "../lib/auth";
import { requireCurrentUserId } from "../lib/currentUser";

type EventRow = {
  id: string;
  title: string;
  date_label: string;
  location: string;
  image: string;
  creator_id?: string | null;
};

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [myEvents, setMyEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setEmail(user.email);
      }

      const userId = await requireCurrentUserId();

      const { data, error } = await supabase
        .from("events")
        .select("id, title, date_label, location, image, creator_id")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setMyEvents((data as EventRow[]) || []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong loading profile.";
      Alert.alert("Profile error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOutUser();

    if (error) {
      Alert.alert("Logout error", error.message);
      return;
    }

    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H</Text>
          </View>

          <Text style={styles.name}>Hive User</Text>
          <Text style={styles.username}>{email || "No email found"}</Text>

          <Text style={styles.bio}>
            Discovering local events and building the city’s social scene through Hive.
          </Text>

          <View style={styles.actionRow}>
            <Pressable style={styles.primaryButton} onPress={loadProfile}>
              <Text style={styles.primaryButtonText}>Refresh</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleLogout}>
              <Text style={styles.secondaryButtonText}>Log Out</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{loading ? "..." : myEvents.length}</Text>
            <Text style={styles.statLabel}>My Events</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>Going</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Events</Text>
          <Text style={styles.sectionLink}>{loading ? "Loading..." : `${myEvents.length} total`}</Text>
        </View>

        {!loading && myEvents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No events yet</Text>
            <Text style={styles.emptyText}>
              Create your first event and it will appear here.
            </Text>
          </View>
        ) : null}

        {myEvents.map((event) => (
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

              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>Posted</Text>
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
  headerCard: {
    backgroundColor: "#0B1124",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#18213F",
    padding: 22,
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#5A6BFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  username: {
    color: "#8E99BE",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  bio: {
    color: "#CDD4EF",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#5A6BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "#151D37",
    borderWidth: 1,
    borderColor: "#263256",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "31.5%",
    backgroundColor: "#0B1124",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#18213F",
    paddingVertical: 18,
    alignItems: "center",
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    color: "#8E99BE",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  sectionLink: {
    color: "#8E99BE",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyCard: {
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
    height: 150,
  },
  eventImageStyle: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 10, 22, 0.16)",
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
  liveBadge: {
    backgroundColor: "#243A94",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#4D6BFF",
  },
  liveBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
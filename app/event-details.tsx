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
    View,
} from "react-native";

export default function EventDetailsScreen() {
  const [interested, setInterested] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
          }}
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
              <Text style={styles.liveBadgeText}>🔥 Tonight’s Highlight</Text>
            </View>

            <Text style={styles.eventTitle}>Neon Nights DJ Pulse</Text>
            <Text style={styles.eventSubtitle}>Downtown Bakersfield • Tonight • 10:00 PM</Text>
          </View>
        </ImageBackground>

        <View style={styles.contentCard}>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>Friday, April 25</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>10:00 PM</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue}>The Echo Lounge</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Interested</Text>
              <Text style={styles.infoValue}>124 People</Text>
            </View>
          </View>

          <View style={styles.organizerCard}>
            <View style={styles.organizerAvatar}>
              <Text style={styles.organizerAvatarText}>NP</Text>
            </View>

            <View style={styles.organizerTextWrap}>
              <Text style={styles.organizerName}>Neon Pulse Events</Text>
              <Text style={styles.organizerMeta}>Organizer • 18 events hosted</Text>
            </View>

            <Pressable
              style={styles.followButton}
              onPress={() => Alert.alert("Followed", "Organizer follow comes tomorrow")}
            >
              <Text style={styles.followButtonText}>Follow</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>
              Step into a late-night club experience with live DJs, neon lighting, packed dance
              floors, and a full weekend crowd. This event is built for people looking for a real
              night out in Bakersfield with music, energy, and a social atmosphere.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What to expect</Text>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🎧 Live DJ</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🍸 Drinks</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>💃 Dance Floor</Text>
              </View>
            </View>

            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🌃 Nightlife</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>📍 Downtown</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              <Text style={styles.locationTitle}>The Echo Lounge</Text>
              <Text style={styles.locationText}>1821 N Street, Bakersfield, CA</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.secondaryAction, interested && styles.secondaryActionActive]}
          onPress={() => setInterested((prev) => !prev)}
        >
          <Text style={styles.secondaryActionText}>
            {interested ? "Interested ✓" : "Interested"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.iconAction, saved && styles.iconActionActive]}
          onPress={() => setSaved((prev) => !prev)}
        >
          <Text style={styles.iconActionText}>{saved ? "🔖" : "📑"}</Text>
        </Pressable>

        <Pressable
          style={styles.primaryAction}
          onPress={() => Alert.alert("Tickets", "External ticket link tomorrow")}
        >
          <Text style={styles.primaryActionText}>Get Tickets</Text>
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
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
 
import React from "react";
import {
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const myEvents = [
  {
    id: "1",
    title: "Neon Nights DJ Pulse",
    time: "Fri • 10:00 PM",
    location: "The Echo Lounge",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    title: "Sunset Rooftop Session",
    time: "Sat • 8:30 PM",
    location: "Skyline Rooftop",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>L</Text>
          </View>

          <Text style={styles.name}>Leo</Text>
          <Text style={styles.username}>@fomo_leo</Text>

          <Text style={styles.bio}>
            Building the city’s nightlife one event at a time. Music, energy, local moments.
          </Text>

          <View style={styles.actionRow}>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Share</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>84</Text>
            <Text style={styles.statLabel}>Going</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>231</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Events</Text>
          <Text style={styles.sectionLink}>View all</Text>
        </View>

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
                <Text style={styles.eventMeta}>{event.time}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>

              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>Live</Text>
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
